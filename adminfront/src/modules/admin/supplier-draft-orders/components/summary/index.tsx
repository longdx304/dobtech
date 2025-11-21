import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { DisplayTotal } from '@/modules/admin/orders/components/common';
import { DraftSupplierOrder } from '@/types/draft-supplier-order';
import { Divider, Empty } from 'antd';
import OrderLine from './order-line';

type Props = {
	dorder: DraftSupplierOrder | undefined;
	isLoading: boolean;
};

const Summary = ({ dorder, isLoading }: Props) => {
	if (!dorder) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan`}</Title>
				</Flex>
			</div>
			<div>
				{dorder?.cart?.items?.map((item: any, i: number) => (
					<OrderLine
						key={item.id}
						item={item}
						currencyCode={dorder.cart?.region?.currency_code}
					/>
				))}
				<Divider className="my-2" />
				<DisplayTotal
					currency={dorder.cart?.region?.currency_code}
					totalAmount={dorder.cart?.subtotal}
					totalTitle={'Tạm tính'}
				/>
				<DisplayTotal
					currency={dorder.cart?.region?.currency_code}
					totalAmount={dorder.cart?.shipping_total}
					totalTitle={'Vận chuyển'}
				/>
				<DisplayTotal
					currency={dorder.cart?.region?.currency_code}
					totalAmount={dorder.cart.tax_total}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={dorder.cart?.region?.currency_code}
					totalAmount={dorder.cart.total}
					totalTitle={'Tổng tiền'}
				/>
			</div>
		</Card>
	);
};

export default Summary;
