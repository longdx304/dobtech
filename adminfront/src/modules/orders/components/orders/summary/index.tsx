import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import {
	DisplayTotal,
	PaymentDetails,
} from '@/modules/orders/components/common';
import { Order, AdminGetVariantsVariantInventoryRes, VariantInventory } from '@medusajs/medusa';
import { ReservationItemDTO } from '@medusajs/types';
import { Divider, Empty } from 'antd';
import _ from 'lodash';
import { useMemo, useEffect, useState } from 'react';
import OrderLine from './order-line';
import { Pencil, Package } from 'lucide-react';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useFeatureFlag } from '@/lib/providers/feature-flag-provider';
import { useMedusa } from 'medusa-react';
import { ActionAbles } from '@/components/Dropdown';
import { useOrderEdit } from '@/modules/orders/components/orders/edit-order-modal/context';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
	// inventoryEnabled?: boolean;
	reservations: ReservationItemDTO[];
};

const Summary = ({
	order,
	isLoading,
	// inventoryEnabled = false,
	reservations = [],
}: Props) => {
	const { showModal } = useOrderEdit();
	const { client } = useMedusa();
	const { isFeatureEnabled } = useFeatureFlag();
	const inventoryEnabled = isFeatureEnabled("inventoryService")
	const [variantInventoryMap, setVariantInventoryMap] = useState<
    Map<string, VariantInventory>
  >(new Map());

	useEffect(() => {
    if (!inventoryEnabled) {
      return
    }

    const fetchInventory = async () => {
      const inventory = await Promise.all(
        order?.items?.map(async (item) => {
          if (!item.variant_id) {
            return
          }
          return await client.admin.variants.getInventory(item.variant_id)
        })
      )

      setVariantInventoryMap(
        new Map(
          inventory
            .filter(
              (
                inventoryItem
                // eslint-disable-next-line max-len
              ): inventoryItem is Response<AdminGetVariantsVariantInventoryRes> =>
                !!inventoryItem
            )
            .map((i) => {
              return [i.variant.id, i.variant]
            })
        )
      )
    }

    fetchInventory()
  }, [order?.items, inventoryEnabled, client.admin.variants])

	const reservationItemsMap = useMemo(() => {
		if (!reservations?.length || !inventoryEnabled) {
			return {};
		}

		return reservations.reduce(
			(acc: Record<string, ReservationItemDTO[]>, item: ReservationItemDTO) => {
				if (!item.line_item_id) {
					return acc;
				}
				acc[item.line_item_id] = acc[item.line_item_id]
					? [...acc[item.line_item_id], item]
					: [item];
				return acc;
			},
			{}
		);
	}, [reservations, inventoryEnabled]);

	const allItemsReserved = useMemo(() => {
    return order?.items?.every((item) => {
      if (
        !item.variant_id ||
        !variantInventoryMap.get(item.variant_id)?.inventory.length
      ) {
        return true
      }

      const reservations = reservationItemsMap[item.id]

      return (
        item.quantity === item.fulfilled_quantity ||
        (reservations &&
          sum(reservations.map((r) => r.quantity)) ===
            item.quantity - (item.fulfilled_quantity || 0))
      )
    })
  }, [order?.items, variantInventoryMap, reservationItemsMap])

	const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
		useMemo(() => {
			let manualRefund = 0;
			let swapRefund = 0;
			let returnRefund = 0;

			const swapAmount = _.sum(
				order?.swaps.map((s) => s.difference_due) || [0]
			);

			if (order?.refunds?.length) {
				order.refunds.forEach((ref) => {
					if (ref.reason === 'other' || ref.reason === 'discount') {
						manualRefund += ref.amount;
					}
					if (ref.reason === 'return') {
						returnRefund += ref.amount;
					}
					if (ref.reason === 'swap') {
						swapRefund += ref.amount;
					}
				});
			}
			return {
				hasMovements:
					swapAmount + manualRefund + swapRefund + returnRefund !== 0,
				swapAmount,
				manualRefund,
				swapRefund,
				returnRefund,
			};
		}, [order]);

	const actions = useMemo(() => {
		const actionAbles = [];
		// if (isFeatureEnabled('order_editing')) {
			actionAbles.push({
				label: <span>{'Chỉnh sửa đơn hàng'}</span>,
				icon: <Pencil size={16} />,
				onClick: () => {
					showModal();
				},
			});
		// }
		if (isFeatureEnabled('inventoryService') && !allItemsReserved) {
			actionAbles.push({
				label: <span>{'Cấp phát'}</span>,
				icon: <Package size={16} />,
				onClick: () => {
					// openReserveItemsModal();
				},
			});
		}
		return actionAbles;
	}, [isFeatureEnabled, allItemsReserved]);

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	const isAllocatable = !['canceled', 'archived'].includes(order.status);

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan`}</Title>
					{/* <Button type="default" onClick={openEdit}>{'Chỉnh sửa đơn hàng'}</Button> */}
					<ActionAbles actions={actions} />
				</Flex>
			</div>
			<div>
				{order?.items?.map((item, i) => (
					<OrderLine
						key={i}
						item={item}
						currencyCode={order.currency_code}
						reservations={reservationItemsMap[item.id]}
						isAllocatable={isAllocatable}
					/>
				))}
				<Divider className="my-2" />
				<DisplayTotal
					currency={order.currency_code}
					totalAmount={order.subtotal}
					totalTitle={'Tạm tính'}
				/>
				{order?.discounts?.map((discount, index) => (
					<DisplayTotal
						key={index}
						currency={order.currency_code}
						totalAmount={-1 * order.discount_total}
						totalTitle={
							<div className="font-normal text-gray-900 flex items-center">
								{'Giảm giá'}
								{/* <Badge className="ml-3" variant="default"> */}
								{discount.code}
								{/* </Badge> */}
							</div>
						}
					/>
				))}
				{order?.gift_card_transactions?.map((gcTransaction, index) => (
					<DisplayTotal
						key={index}
						currency={order.currency_code}
						totalAmount={-1 * gcTransaction.amount}
						totalTitle={
							<div className="font-normal text-gray-900 flex items-center">
								Gift card:
								{/* <Badge className="ml-3" variant="default"> */}
								{gcTransaction.gift_card.code}
								{/* </Badge> */}
								{/* <div className="ml-2">
                  <CopyToClipboard
                    value={gcTransaction.gift_card.code}
                    showValue={false}
                    iconSize={16}
                  />
                </div> */}
							</div>
						}
					/>
				))}
				<DisplayTotal
					currency={order.currency_code}
					totalAmount={order.shipping_total}
					totalTitle={'Vận chuyển'}
				/>
				<DisplayTotal
					currency={order.currency_code}
					totalAmount={order.tax_total}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={order.currency_code}
					totalAmount={order.total}
					totalTitle={hasMovements ? 'Tổng ban đầu' : 'Tổng cộng'}
				/>
				<Divider className="my-2" />
				<PaymentDetails
					manualRefund={manualRefund}
					swapAmount={swapAmount}
					swapRefund={swapRefund}
					returnRefund={returnRefund}
					paidTotal={order.paid_total}
					refundedTotal={order.refunded_total}
					currency={order.currency_code}
				/>
			</div>
		</Card>
	);
};

export default Summary;
