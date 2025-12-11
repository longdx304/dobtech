'use client';
import { FloatButton } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { useAdminDraftOrderTransferOrder } from '@/lib/hooks/api/draft-orders';
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { getErrorMessage } from '@/lib/utils';
import { ERoutes } from '@/types/routes';
import { LineItemReq } from '@/types/order';
import { Modal as AntdModal, message } from 'antd';
import _ from 'lodash';
import { Plus, Search } from 'lucide-react';
import { useAdminDeleteDraftOrder, useAdminDraftOrders } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import { generatePdfBlob } from '../../../orders/components/orders/new-order/order-pdf';
import { pdfOrderRes } from '../../../orders/components/orders/new-order';
import DraftOrderModal from '../../components/draft-order-modal';
import NewDraftOrderFormProvider from '../../hooks/use-new-draft-form';
import draftOrderColumns from './draft-order-column';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const DraftOrderList: FC<Props> = () => {
	const router = useRouter();

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentDraftOrderId, setCurrentDraftOrderId] = useState<string | null>(
		null
	);
	const [isSendEmail, setIsSendEmail] = useState(false);

	// Mutations api
	const transferOrder = useAdminDraftOrderTransferOrder();
	const cancelOrder = useAdminDeleteDraftOrder(currentDraftOrderId ?? '');
	const uploadFile = useAdminUploadFile();

	const {
		state: stateDraftOrdersModal,
		onOpen: openDraftOrdersModal,
		onClose: closeDraftOrdersModal,
	} = useToggleState(false);

	const { draft_orders, isLoading, count } = useAdminDraftOrders(
		{
			q: searchValue || undefined,
			offset,
			limit: DEFAULT_PAGE_SIZE,
			expand: 'cart,cart.items,cart.shipping_address,cart.billing_address,cart.customer',
		},
		{
			keepPreviousData: true,
		}
	);

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const generateFilePdf = async (draftOrder: any): Promise<string> => {
		console.log("🚀 ~ draftOrder:", draftOrder)

		// Get items from cart, not directly from draft order
		const items = draftOrder.cart?.items || [];
		const customer = draftOrder.cart?.customer;
		const shippingAddress = draftOrder.cart?.shipping_address;

		// Prepare PDF data
		const pdfReq: pdfOrderRes = {
			email: draftOrder.cart?.email || draftOrder.email,
			userId: draftOrder.cart?.id || draftOrder.id,
			user: null, // Can be fetched if needed
			customer: {
				first_name: customer?.first_name || shippingAddress?.first_name || '',
				last_name: customer?.last_name || shippingAddress?.last_name || '',
				email: customer?.email || draftOrder.cart?.email || draftOrder.email,
				phone: customer?.phone || shippingAddress?.phone || '',
			},
			address: `${shippingAddress?.address_1 || ''} ${shippingAddress?.address_2 || ''} ${shippingAddress?.city || ''} ${shippingAddress?.province || ''}`.trim(),
			lineItems: items.map((item: any) => ({
				variantId: item.variant_id,
				quantity: item.quantity,
				unit_price: item.unit_price,
				title: item.title,
				sku: item.variant?.sku || '',
			})),
			totalQuantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
			countryCode: shippingAddress?.country_code || 'vn',
			isSendEmail: false,
		};

		// Generate pdf blob
		const pdfBlob = await generatePdfBlob(pdfReq);

		// Create a File object
		const fileName = `purchase-order.pdf`;

		// Create a File object
		const files = new File([pdfBlob], fileName, {
			type: 'application/pdf',
		});

		// Upload pdf to s3 using Medusa uploads API
		const uploadRes = await uploadFile.mutateAsync({
			files,
			prefix: 'orders',
		});

		const pdfUrl = uploadRes.uploads[0].url;

		return pdfUrl;
	};

	const handleTransferToOrder = async (id: string) => {
		try {
			// Find the draft order from the current data
			const draftOrder = draft_orders?.find((order: any) => order.id === id);

			if (!draftOrder) {
				message.error('Không tìm thấy thông tin draft order');
				return;
			}

			// Generate PDF for the draft order
			const urlPdf = await generateFilePdf(draftOrder);

			// Transfer the draft order to order with PDF URL
			await transferOrder.mutateAsync({ id, isSendEmail, urlPdf });

			message.success('Chuyển đơn hàng thành công');
		} catch (error) {
			message.error('Có lỗi xảy ra khi chuyển đơn hàng');
			console.error('Error transferring order:', error);
		} finally {
			setCurrentDraftOrderId(null);
		}
	};

	const handleDeleteDraftOrder = (id: string) => {
		setCurrentDraftOrderId(id);
		AntdModal.confirm({
			title: 'Xác nhận huỷ đơn hàng',
			content: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
			onOk: async () => {
				await cancelOrder.mutateAsync(undefined, {
					onSuccess: () => {
						message.success('Huỷ đơn hàng thành công');
					},
					onError: (error: any) => {
						message.error(getErrorMessage(error));
					},
				});
			},
		});
	};

	const columns = useMemo(() => {
		return draftOrderColumns({
			handleTransferToOrder,
			handleDeleteDraftOrder,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draft_orders]);

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.DRAFT_ORDERS}/${record.id}`);
	};

	const handleCreateDraftOrder = () => {
		openDraftOrdersModal();
	};

	const handleCancelDraftOrder = () => {
		closeDraftOrdersModal();
	};

	return (
		<div className="w-full">
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					placeholder="Tìm kiếm đơn hàng..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading}
				columns={columns as any}
				dataSource={draft_orders ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					className: 'cursor-pointer',
				})}
				pagination={{
					total: Math.floor(count ?? 0 / (DEFAULT_PAGE_SIZE ?? 0)),
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages || 1,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} đơn hàng`,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} strokeWidth={2} />}
				type="primary"
				onClick={handleCreateDraftOrder}
				data-testid="btnCreateSupplier"
			/>
			{stateDraftOrdersModal && (
				<NewDraftOrderFormProvider>
					<DraftOrderModal
						state={stateDraftOrdersModal}
						handleOk={handleCancelDraftOrder}
						handleCancel={handleCancelDraftOrder}
						setIsSendEmail={setIsSendEmail}
					/>
				</NewDraftOrderFormProvider>
			)}
		</div>
	);
};

export default DraftOrderList;
