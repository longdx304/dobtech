import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { DisplayTotal, PaymentDetails } from "@/modules/orders/components/common";
import {
  Order
} from "@medusajs/medusa";
import { ReservationItemDTO } from "@medusajs/types";
import { Empty } from 'antd';
import _ from "lodash";
import { useMemo } from 'react';
import OrderLine from './order-line';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
	inventoryEnabled?: boolean;
	reservations: ReservationItemDTO[];
};

const Summary = ({ order, isLoading, inventoryEnabled = false, reservations = [] }: Props) => {
	console.log('order', order)
	const reservationItemsMap = useMemo(() => {
    if (!reservations?.length || !inventoryEnabled) {
      return {}
    }

    return reservations.reduce(
      (acc: Record<string, ReservationItemDTO[]>, item: ReservationItemDTO) => {
        if (!item.line_item_id) {
          return acc
        }
        acc[item.line_item_id] = acc[item.line_item_id]
          ? [...acc[item.line_item_id], item]
          : [item]
        return acc
      },
      {}
    )
  }, [reservations, inventoryEnabled]);

	const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
    useMemo(() => {
      let manualRefund = 0
      let swapRefund = 0
      let returnRefund = 0

      const swapAmount = _.sum(order?.swaps.map((s) => s.difference_due) || [0])

      if (order?.refunds?.length) {
        order.refunds.forEach((ref) => {
          if (ref.reason === "other" || ref.reason === "discount") {
            manualRefund += ref.amount
          }
          if (ref.reason === "return") {
            returnRefund += ref.amount
          }
          if (ref.reason === "swap") {
            swapRefund += ref.amount
          }
        })
      }
      return {
        hasMovements:
          swapAmount + manualRefund + swapRefund + returnRefund !== 0,
        swapAmount,
        manualRefund,
        swapRefund,
        returnRefund,
      }
    }, [order])

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	};

	const isAllocatable = !["canceled", "archived"].includes(order.status);
	console.log('order', order)

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan đơn hàng`}</Title>
					<Button type="default">{'Chỉnh sửa đơn hàng'}</Button>
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
				<DisplayTotal
          currency={order.currency_code}
          totalAmount={order.subtotal}
          totalTitle={"Tạm tính"}
        />
				{order?.discounts?.map((discount, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.discount_total}
            totalTitle={
              <div className="font-normal text-gray-900 flex items-center">
                {"Giảm giá"}
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
          totalTitle={"Vận chuyển"}
        />
				<DisplayTotal
          currency={order.currency_code}
          totalAmount={order.tax_total}
          totalTitle={"Thuế"}
        />
				<DisplayTotal
          variant={"large"}
          currency={order.currency_code}
          totalAmount={order.total}
          totalTitle={
            hasMovements
              ? "Tổng ban đầu"
              : "Tổng"
          }
        />
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