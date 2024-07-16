import { message } from 'antd';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Title, Text } from '@/components/Typography';
import { Select } from '@/components/Select';
import {
	useAdminCreateFulfillment,
	useAdminFulfillClaim,
	useAdminFulfillSwap,
	useAdminStockLocations,
} from 'medusa-react';
import { useMemo, useState } from 'react';
import { currencies } from '@/types/currencies';
import { Option } from '@/types/shared';
import { getErrorMessage } from '@/lib/utils';
import {
	AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
	AdminPostOrdersOrderFulfillmentsReq,
	AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
	ClaimOrder,
	Order,
	Swap,
	LineItem,
} from '@medusajs/medusa';
import FulfillmentItems from './fulfillment-items';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	orderToFulfill: Order;
	orderId: Order['id'];
}

export const getFulfillAbleQuantity = (item: LineItem): number => {
	return item.quantity - (item.fulfilled_quantity || 0);
};

type actionType =
	| typeof createOrderFulfillment
	| typeof createSwapFulfillment
	| typeof createClaimFulfillment;

const CreateFulfillmentModal = ({
	state,
	handleOk,
	handleCancel,
	orderToFulfill,
	orderId,
}: Props) => {
	const [errors, setErrors] = useState({});
	const [quantities, setQuantities] = useState<Record<string, number>>(
		'items' in orderToFulfill
			? (orderToFulfill as Order).items.reduce((acc, next) => {
					return {
						...acc,
						[next.id]: getFulfillAbleQuantity(next),
					};
			  }, {})
			: {}
	);

	const items =
		'items' in orderToFulfill
			? orderToFulfill.items
			: orderToFulfill.additional_items;

	const createOrderFulfillment = useAdminCreateFulfillment(orderId);
	const createSwapFulfillment = useAdminFulfillSwap(orderId);
	const createClaimFulfillment = useAdminFulfillClaim(orderId);

	const isSubmitting =
		createOrderFulfillment.isLoading ||
		createSwapFulfillment.isLoading ||
		createClaimFulfillment.isLoading;

	const createFulfillment = async () => {
		if (Object.keys(errors).length > 0) {
			message.error('Vui lòng chọn số lượng cho tất cả các sản phẩm');
			return;
		}
		const [type] = orderToFulfill.id.split('_');
		let action: actionType = createOrderFulfillment;
		let successText = 'Đơn hàng đã được đóng gói thành công.';
		let requestObj;

		switch (type) {
			case 'swap':
				action = createSwapFulfillment;
				successText = 'Thực hiện trao đổi thành công.';
				requestObj = {
					swap_id: orderToFulfill.id,
					no_notification: false,
				} as AdminPostOrdersOrderSwapsSwapFulfillmentsReq;
				break;

			case 'claim':
				action = createClaimFulfillment;
				successText = 'Thực hiện đòi lại thành công.';
				requestObj = {
					claim_id: orderToFulfill.id,
					no_notification: false,
				} as AdminPostOrdersOrderClaimsClaimFulfillmentsReq;
				break;

			default:
				requestObj = {
					no_notification: false,
				} as AdminPostOrdersOrderFulfillmentsReq;

				requestObj.items = Object.entries(quantities)
					.filter(([, value]) => !!value)
					.map(([key, value]) => ({
						item_id: key,
						quantity: value,
					}));
				break;
		}

		await action.mutateAsync(requestObj, {
			onSuccess: () => {
				message.success(successText);
				handleOk();
				// handleCancel();
			},
			onError: (err) => message.error(getErrorMessage(err)),
		});
	};

	return (
		<Modal
			open={state}
			handleOk={createFulfillment}
			isLoading={isSubmitting}
			handleCancel={handleCancel}
			disabled={!Object.values(quantities).some((quantity) => quantity > 0)}
			// width={800}
		>
			<Title level={3} className="text-center">
				{'Xác nhận đơn đóng hàng'}
			</Title>
			<Flex vertical justify="flex-start" className="text-xs pt-4">
				<Text strong>{'Các sản phẩm cần đóng gói'}</Text>
				<Text className="text-gray-500 text-[13px]">
					{'Chọn số lượng mục mà bạn muốn thực hiện.'}
				</Text>
			</Flex>
			<FulfillmentItems
				items={items}
				quantities={quantities}
				setQuantities={setQuantities}
				// locationId={locationSelectValue.value}
				setErrors={setErrors}
			/>
		</Modal>
	);
};

export default CreateFulfillmentModal;
