import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import {
	AttachmentEvent,
	ClaimEvent,
	ExchangeEvent,
	ItemsFulfilledEvent,
	ItemsShippedEvent,
	OrderEditEvent,
	OrderEditRequestedEvent,
	OrderPlacedEvent,
	PaidEvent,
	PaymentRequiredEvent,
	RefundEvent,
	RefundRequiredEvent,
	ReturnEvent,
	TimelineEvent,
	TransferredToWarehouseEvent,
} from '@/modules/admin/orders/hooks/use-build-timeline';
import {
	AdminPostOrdersOrderReq,
	LineItem,
	Order,
	Region
} from '@medusajs/medusa';
import { Empty, message } from 'antd';
import { FileDown, Warehouse } from 'lucide-react';
import { useAdminOrder, useAdminUpdateOrder } from 'medusa-react';
import { useState } from 'react';
import { pdfOrderRes } from '../new-order';
import { getCustomerNote } from '../new-order/customer-note';
import { generateHandoverPdfBlob } from '../new-order/handover-pdf';
import { generatePdfBlob } from '../new-order/order-pdf';
import useOrdersExpandParam from '../utils/use-admin-expand-parameter';
import Attachment from './timeline-events/attachment';
import TransferredToWarehouse from './timeline-events/transferred-to-warehouse';
import Claim from './timeline-events/claim';
import Exchange from './timeline-events/exchange';
import ItemsFulfilled from './timeline-events/items-fulfilled';
import ItemsShipped from './timeline-events/items-shipped';
import ClaimModal from './timeline-events/modal/claim';
import ReturnMenu from './timeline-events/modal/returns';
import SwapModal from './timeline-events/modal/swap';
import OrderCanceled from './timeline-events/order-canceled';
import EditCanceled from './timeline-events/order-edit/canceled';
import ChangedPrice from './timeline-events/order-edit/changed-price';
import EditConfirmed from './timeline-events/order-edit/confirmed';
import EditCreated from './timeline-events/order-edit/created';
import EditDeclined from './timeline-events/order-edit/declined';
import PaymentRequired from './timeline-events/order-edit/payment-required';
import RefundRequired from './timeline-events/order-edit/refund-required';
import EditRequested from './timeline-events/order-edit/requested';
import OrderPlaced from './timeline-events/order-placed';
import Paid from './timeline-events/paid';
import Refund from './timeline-events/refund';
import Return from './timeline-events/return';

type Props = {
	orderId: Order['id'];
	isLoading: boolean;
	refetchOrder: () => void;
	events: TimelineEvent[] | undefined;
	refetch: () => void;
};

const Timeline = ({
	orderId,
	isLoading,
	refetchOrder,
	events,
	refetch,
}: Props) => {
	const { user } = useUser();
	const { orderRelations } = useOrdersExpandParam();
	const uploadFile = useAdminUploadFile();
	const updateOrder = useAdminUpdateOrder(orderId);
	const [showRequestReturn, setShowRequestReturn] = useState<boolean>(false);
	const [showCreateSwap, setShowCreateSwap] = useState<boolean>(false);
	const [showRegisterClaim, setShowRegisterClaim] = useState<boolean>(false);
	const { order, isLoading: isOrderLoading } = useAdminOrder(
		orderId,
		{
			expand: orderRelations,
		}
	);

	const buildPdfRequest = (): pdfOrderRes => {
		if (!order?.customer) {
			throw new Error('Đơn hàng không có thông tin khách hàng');
		}
		if (!user) {
			throw new Error('Không thể xác định người dùng hiện tại');
		}

		const items = Array.isArray(order.items) ? order.items : [];
		const shippingAddress = order.shipping_address;
		const address = [
			shippingAddress?.address_1,
			shippingAddress?.address_2,
			shippingAddress?.province,
			shippingAddress?.city,
			shippingAddress?.country_code,
		]
			.filter(Boolean)
			.join(', ');

		return {
			email: order.customer.email || '',
			userId: user.id,
			user,
			customer: {
				first_name: order.customer.first_name,
				last_name: order.customer.last_name,
				email: order.customer.email,
				phone: order.customer.phone,
			},
			address,
			lineItems: items.map((item: LineItem) => ({
				variantId: item.variant_id ?? '',
				quantity: Number(item.quantity) || 0,
				unit_price: Number(item.unit_price) || 0,
				title: `${item.title || 'Sản phẩm chưa xác định'} - ${
					item.description || ''
				}`,
				sku: item.variant?.sku || '',
			})),
			totalQuantity: items.reduce(
				(total, item) => total + (Number(item.quantity) || 0),
				0
			),
			countryCode: shippingAddress?.country_code || '',
			isSendEmail: false,
			customerNote: getCustomerNote(order.customer),
		};
	};

	const generateFilePdf = async (): Promise<string> => {
		const pdfBlob = await generatePdfBlob(buildPdfRequest());
		const files = new File([pdfBlob], 'purchase-order.pdf', {
			type: 'application/pdf',
		});
		const uploadRes = await uploadFile.mutateAsync({ files, prefix: 'orders' });
		const pdfUrl = uploadRes.uploads?.[0]?.url;
		if (!pdfUrl) throw new Error('Không nhận được đường dẫn file PDF');
		return pdfUrl;
	};

	const updateDocFileOrder = async () => {
		try {
			message.loading('Đang cập nhật file order...');
			const pdfUrl = await generateFilePdf();
			const files: any[] = Array.isArray(order?.metadata?.files)
				? order.metadata.files
				: [];

			await updateOrder.mutateAsync({
				metadata: {
					files: [
						...files,
						{
							url: pdfUrl,
							name: 'Order PDF',
							created_at: new Date().toISOString(),
						},
					],
				},
			} as AdminPostOrdersOrderReq & { metadata: { files: any[] } });
			refetchOrder();
			message.success('Cập nhật file order thành công');
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

	const updateHandoverFileOrder = async () => {
		try {
			message.loading('Đang tạo biên bản bàn giao...');
			const pdfBlob = await generateHandoverPdfBlob(buildPdfRequest());
			const handoverFile = new File([pdfBlob], 'handover.pdf', {
				type: 'application/pdf',
			});
			const uploadRes = await uploadFile.mutateAsync({
				files: handoverFile,
				prefix: 'orders',
			});
			const pdfUrl = uploadRes.uploads?.[0]?.url;
			if (!pdfUrl) throw new Error('Không nhận được đường dẫn file PDF');

			const files: any[] = Array.isArray(order?.metadata?.files)
				? order.metadata.files
				: [];
			await updateOrder.mutateAsync({
				metadata: {
					files: [
						...files,
						{
							url: pdfUrl,
							name: 'Biên Bản Bàn Giao',
							created_at: new Date().toISOString(),
						},
					],
				},
			} as AdminPostOrdersOrderReq & { metadata: { files: any[] } });
			refetchOrder();
			message.success('Tạo biên bản bàn giao thành công');
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

	const handleTransferToWarehouse = async () => {
		try {
			message.loading('Đang chuyển đơn hàng sang kho...');
			const currentMetadata = order?.metadata ? { ...order.metadata } : {};

			await updateOrder.mutateAsync({
				metadata: {
					...currentMetadata,
					transferred_to_warehouse: true,
					transferred_at: new Date().toISOString(),
					transferred_by_user_id: user?.id,
					transferred_by_user_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(),
				},
			} as AdminPostOrdersOrderReq & { metadata: any });
			refetchOrder();
			message.success('Chuyển đơn hàng sang kho thành công');
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

	const actions = [
		{
			label: <span className="w-full">{'Chuyển sang Kho'}</span>,
			key: 'transfer-warehouse',
			icon: <Warehouse size={18} />,
			onClick: handleTransferToWarehouse,
		},
		// {
		// 	label: <span className="w-full">{'Yêu cầu trả hàng'}</span>,
		// 	key: 'require_return',
		// 	icon: <RotateCcw size={18} />,
		// 	onClick: () => setShowRequestReturn(true),
		// },
		// {
		// 	label: <span className="w-full">{'Đăng ký trao đổi'}</span>,
		// 	key: 'exchange',
		// 	icon: <RefreshCcw size={18} />,
		// 	onClick: () => setShowCreateSwap(true),
		// },
		// {
		// 	label: <span className="w-full">{'Đăng ký đòi hỏi'}</span>,
		// 	key: 'claim',
		// 	icon: <CircleAlert size={18} />,
		// 	onClick: () => setShowRegisterClaim(true),
		// },
		{
			label: <span className="w-full">{'Cập nhật file order'}</span>,
			key: 'update-file',
			icon: <FileDown size={18} />,
			onClick: updateDocFileOrder,
		},
		{
			label: <span className="w-full">{'Biên Bản Bàn Giao'}</span>,
			key: 'handover-file',
			icon: <FileDown size={18} />,
			onClick: updateHandoverFileOrder,
		},
	];

	if (!events?.length) {
		return (
			<Card loading={isLoading || isOrderLoading}>
				<Empty description="Chưa có sự kiện nào xảy ra" />
			</Card>
		);
	}

	return (
		<Card
			loading={isLoading || isOrderLoading}
			className="px-4 max-h-[calc(100vh-80px)] overflow-y-auto sticky top-[20px]"
		>
			<div>
				<Flex align="center" justify="space-between" className="pb-4">
					<Title level={4}>{`Dòng thời gian`}</Title>
					<div className="flex justify-end items-center gap-4">
						<ActionAbles actions={actions} />
					</div>
				</Flex>
				<div className="flex flex-col text-xs">
					{events?.map((event, i) => {
						return (
							<div key={i}>
								{switchOnType(event, refetch, refetchOrder, order?.region)}
							</div>
						);
					})}
				</div>
			</div>
			{showRequestReturn && order && (
				<ReturnMenu
					order={order}
					state={showRequestReturn}
					onClose={() => setShowRequestReturn(false)}
				/>
			)}
			{showCreateSwap && order && (
				<SwapModal
					order={order}
					state={showCreateSwap}
					onClose={() => setShowCreateSwap(false)}
				/>
			)}
			{showRegisterClaim && order && (
				<ClaimModal
					order={order}
					state={showRegisterClaim}
					onClose={() => setShowRegisterClaim(false)}
				/>
			)}
		</Card>
	);
};

export default Timeline;

function switchOnType(
	event: TimelineEvent,
	refetch: () => void,
	refetchOrder: () => void,
	region: Region | undefined
) {
	switch (event.type) {
		case 'placed':
			return <OrderPlaced event={event as OrderPlacedEvent} />;
		case 'fulfilled':
			return <ItemsFulfilled event={event as ItemsFulfilledEvent} />;
		// case "note":
		//   return <Note event={event as NoteEvent} />
		case 'shipped':
			return <ItemsShipped event={event as ItemsShippedEvent} />;
		case 'canceled':
			return <OrderCanceled event={event as TimelineEvent} />;
		case 'return':
			return (
				<Return
					event={event as ReturnEvent}
					refetch={refetch}
					refetchOrder={refetchOrder}
				/>
			);
		case 'exchange':
			return (
				<Exchange
					refetchOrder={refetchOrder}
					key={event.id}
					event={event as ExchangeEvent}
					refetch={refetch}
				/>
			);
		case 'claim':
			return (
				<Claim
					refetchOrder={refetchOrder}
					event={event as ClaimEvent}
					refetch={refetch}
				/>
			);
		// case "notification":
		//   return <Notification event={event as NotificationEvent} />
		case 'refund':
			return <Refund event={event as RefundEvent} />;
		case 'paid':
			return <Paid event={event as PaidEvent} />;
		case 'edit-created':
			return (
				<EditCreated
					event={event as OrderEditEvent}
					refetchOrder={refetchOrder}
				/>
			);
		case 'edit-canceled':
			return <EditCanceled event={event as OrderEditEvent} />;
		case 'edit-declined':
			return <EditDeclined event={event as OrderEditEvent} />;
		case 'edit-confirmed':
			return <EditConfirmed event={event as OrderEditEvent} />;
		case 'edit-requested':
			return <EditRequested event={event as OrderEditRequestedEvent} />;
		case 'refund-required':
			return <RefundRequired event={event as RefundRequiredEvent} />;
		case 'payment-required':
			return <PaymentRequired event={event as PaymentRequiredEvent} />;
		case 'change-price':
			return <ChangedPrice event={event as any} region={region} />;
		case 'attachment':
			return <Attachment event={event as AttachmentEvent} />;
		case 'transferred-to-warehouse':
			return <TransferredToWarehouse event={event as TransferredToWarehouseEvent} />;
		default:
			return null;
	}
}
