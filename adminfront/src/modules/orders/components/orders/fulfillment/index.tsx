import {
	Order,
	Fulfillment as TFulfillment,
	ClaimOrder,
	Swap,
	LineItem,
} from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import StatusIndicator from '@/modules/common/components/status-indicator';
import { Empty, Modal as AntdModal, message, Divider } from 'antd';
import dayjs from 'dayjs';
import {
	useAdminCancelOrder,
	useAdminCancelClaimFulfillment,
	useAdminCancelFulfillment,
	useAdminCancelSwapFulfillment,
} from 'medusa-react';
import { getErrorMessage } from '@/lib/utils';
import { Store, Package, CircleX } from 'lucide-react';
import { useState } from 'react';
import _ from 'lodash';
import { TrackingLink } from '@/modules/orders/components/common';
import { BadgeButton, Button } from '@/components/Button';
import { ActionAbles } from '@/components/Dropdown';
import useStockLocations from '@/modules/orders/hooks/use-stock-locations';
import useToggleState from '@/lib/hooks/use-toggle-state';
import CreateFulfillmentModal from './create-fulfillment-modal';
import MarkShippedModal from './mark-shipped-modal';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
	refetch: () => void;
};

type OrderDetailFulfillment = {
	title: string;
	type: string;
	fulfillment: TFulfillment;
	swap?: Swap;
	claim?: ClaimOrder;
};

const gatherAllFulfillments = (order: Order) => {
	if (!order) {
		return [];
	}

	const all: OrderDetailFulfillment[] = [];

	order.fulfillments.forEach((f: any, index: number) => {
		all.push({
			title: `Fulfillment #${index + 1}`,
			type: 'default',
			fulfillment: f,
		});
	});

	if (order.claims?.length) {
		order.claims.forEach((claim: any) => {
			if (claim.fulfillment_status !== 'not_fulfilled') {
				claim.fulfillments.forEach((fulfillment: any, index: number) => {
					all.push({
						title: `Claim fulfillment #${index + 1}`,
						type: 'claim',
						fulfillment,
						claim,
					});
				});
			}
		});
	}

	if (order.swaps?.length) {
		order.swaps.forEach((swap: any) => {
			if (swap.fulfillment_status !== 'not_fulfilled') {
				swap.fulfillments.forEach((fulfillment: any, index: number) => {
					all.push({
						title: `Swap fulfillment #${index + 1}`,
						type: 'swap',
						fulfillment,
						swap,
					});
				});
			}
		});
	}

	return all;
};

const Fulfillment = ({ order, isLoading, refetch }: Props) => {
	const [fulfillmentToShip, setFulfillmentToShip] = useState(null);
	const { state, onOpen, onClose } = useToggleState(false);

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	const anyItemsToFulfil = order.items.some(
		(item: LineItem) => item.quantity > (item.fulfilled_quantity ?? 0)
	);

	const allFulfillments = gatherAllFulfillments(order);

	const handleOkFulfillment = () => {
		onClose();
	};

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="flex-start" justify="space-between" className="pb-2">
					<Title level={4}>{`Fulfillment`}</Title>
					<div className="flex flex-col-reverse lg:flex-row gap-0 justify-end items-center lg:gap-4">
						<FulfillmentStatus status={order!.fulfillment_status} />
						{order.status !== 'canceled' && anyItemsToFulfil && (
							<Button type="default" onClick={onOpen}>
								{'Xác nhận đóng gói'}
							</Button>
						)}
					</div>
				</Flex>
			</div>
			<div className="mt-6">
				{order.shipping_methods.map((method: any) => (
					<div className="flex flex-col text-xs" key={method.id}>
						<span className="font-normal text-gray-500">
							{'Phương thức vận chuyển'}
						</span>
						<span className="font-normal text-gray-900 mt-2">
							{method?.shipping_option?.name || ''}
						</span>
					</div>
				))}
				<Divider className="mt-4 mb-2" />
				<div className="">
					{allFulfillments.map((fulfillmentObj: any, i: number) => (
						<FormattedFulfillment
							key={i}
							order={order}
							fulfillmentObj={fulfillmentObj}
							setFulfillmentToShip={setFulfillmentToShip}
						/>
					))}
				</div>
			</div>
			<CreateFulfillmentModal
				refetch={refetch}
				state={state}
				orderToFulfill={order as any}
				handleCancel={() => onClose()}
				orderId={order.id}
				handleOk={handleOkFulfillment}
			/>
			{fulfillmentToShip && (
				<MarkShippedModal
					handleCancel={() => setFulfillmentToShip(null)}
					state={!!fulfillmentToShip}
					fulfillment={fulfillmentToShip}
					orderId={order.id}
				/>
			)}
		</Card>
	);
};

export default Fulfillment;

const FulfillmentStatus = ({
	status,
}: {
	status: Order['fulfillment_status'];
}) => {
	switch (status) {
		case 'shipped':
			return (
				<StatusIndicator
					title="Đã gửi"
					variant="success"
					className="font-normal"
				/>
			);
		case 'fulfilled':
			return (
				<StatusIndicator
					title="Đã thực hiện"
					variant="warning"
					className="font-normal"
				/>
			);
		case 'canceled':
			return (
				<StatusIndicator
					title="Đã huỷ"
					variant="danger"
					className="font-normal"
				/>
			);
		case 'partially_fulfilled':
			return (
				<StatusIndicator
					title="Thực hiện một phần"
					variant="warning"
					className="font-normal"
				/>
			);
		case 'requires_action':
			return (
				<StatusIndicator
					title="Yêu cầu thực hiện"
					variant="danger"
					className="font-normal"
				/>
			);
		case 'not_fulfilled':
			return (
				<StatusIndicator
					title="Chờ thực hiện"
					variant="danger"
					className="font-normal"
				/>
			);
		case 'partially_shipped':
			return (
				<StatusIndicator
					title="Gửi một phần"
					variant="warning"
					className="font-normal"
				/>
			);
		default:
			return null;
	}
};

const FormattedFulfillment = ({
	setFulfillmentToShip,
	order,
	fulfillmentObj,
}: any) => {
	const cancelFulfillment = useAdminCancelFulfillment(order.id);
	const cancelSwapFulfillment = useAdminCancelSwapFulfillment(order.id);
	const cancelClaimFulfillment = useAdminCancelClaimFulfillment(order.id);
	const { getLocationNameById } = useStockLocations();
	const { fulfillment } = fulfillmentObj;
	const hasLinks = !!fulfillment.tracking_links?.length;

	const getData = () => {
		switch (true) {
			case !!fulfillment?.claim_order_id:
				return {
					resourceId: fulfillment.claim_order_id,
					resourceType: 'claim',
				};
			case !!fulfillment?.swap_id:
				return {
					resourceId: fulfillment.swap_id,
					resourceType: 'swap',
				};
			default:
				return { resourceId: order?.id, resourceType: 'order' };
		}
	};

	const handleCancelFulfillment = async () => {
		const { resourceId, resourceType } = getData();

		const shouldCancel = AntdModal.confirm({
			title: 'Huỷ fulfillment',
			content: 'Bạn có chắc chắn muốn hủy thực hiện không?',
			onOk: async () => {
				switch (resourceType) {
					case 'swap':
						return cancelSwapFulfillment.mutate(
							{ swap_id: resourceId, fulfillment_id: fulfillment.id },
							{
								onSuccess: () => message.success('Hủy trao đổi thành công'),
								onError: (err) => message.error(getErrorMessage(err)),
							}
						);
					case 'claim':
						return cancelClaimFulfillment.mutate(
							{ claim_id: resourceId, fulfillment_id: fulfillment.id },
							{
								onSuccess: () => message.success('Hủy đơn thành công'),
								onError: (err) => message.error(getErrorMessage(err)),
							}
						);
					default:
						return cancelFulfillment.mutate(fulfillment.id, {
							onSuccess: () => message.success('Hủy thực hiện thành công'),
							onError: (err) => message.error(getErrorMessage(err)),
						});
				}
			},
		});
	};

	return (
		<div className="flex w-full justify-between">
			<div className="flex flex-col py-2">
				<div className="text-gray-900 text-xs">
					{fulfillment.canceled_at
						? 'Thực hiện đã bị hủy'
						: `${fulfillmentObj.title} Được thực hiện bởi ${_.capitalize(
								fulfillment.provider_id
						  )}`}
				</div>
				<div className="text-gray-500 flex text-xs items-center">
					{!fulfillment.shipped_at ? 'Chưa gửi' : 'Theo dõi đơn'}
					{hasLinks &&
						fulfillment.tracking_links.map((tl: any, j: any) => (
							<TrackingLink key={j} trackingLink={tl} />
						))}
				</div>
				{!fulfillment.canceled_at && fulfillment.location_id && (
					<div className="flex flex-col">
						<div className="text-gray-500 font-semibold text-xs">
							{fulfillment.shipped_at ? 'Gửi từ' : 'Vận chuyển từ'}
						</div>
						<div className="flex items-center pt-2 text-xs">
							<BadgeButton className="mr-2" icon={<Store />} />
							{getLocationNameById(fulfillment.location_id)}
						</div>
					</div>
				)}
			</div>
			{!fulfillment.canceled_at && !fulfillment.shipped_at && (
				<div className="flex items-center space-x-2">
					<ActionAbles
						actions={[
							{
								label: 'Đánh dấu đã gửi',
								icon: <Package size={20} />,
								key: 'item-1',
								onClick: () => setFulfillmentToShip(fulfillment),
							},
							{
								label: 'Hủy thực hiện',
								icon: <CircleX size={20} />,
								key: 'item-2',
								danger: true,
								onClick: () => handleCancelFulfillment(),
							},
						]}
					/>
				</div>
			)}
		</div>
	);
};
