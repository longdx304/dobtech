import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import DraftOrderEditModal from '@/modules/admin/draft-orders/components/draft-order-edit-modal';
import { DisplayTotal } from '@/modules/admin/orders/components/common';
import { DraftOrder } from '@medusajs/medusa';
import { Divider, Empty } from 'antd';
import { Pencil } from 'lucide-react';
import OrderLine from './order-line';

type Props = {
	dorder: DraftOrder | undefined;
	isLoading: boolean;
};

const Summary = ({ dorder, isLoading }: Props) => {
	const {
		state: editState,
		onOpen: openEdit,
		onClose: closeEdit,
	} = useToggleState(false);

	if (!dorder) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}
	const cart = dorder.cart;
	if (!cart) {
		return (
			<Card loading={isLoading}>
				<Empty description="Đơn nháp chưa có dữ liệu giỏ hàng" />
			</Card>
		);
	}
	const cartItems = Array.isArray(cart.items) ? cart.items : [];

	return (
		<>
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan`}</Title>
					{dorder.status === 'open' && (
						<Button
							type="default"
							size="small"
							icon={<Pencil size={14} />}
							onClick={openEdit}
						>
							Chỉnh sửa
						</Button>
					)}
				</Flex>
			</div>
			<div>
				{cartItems.map((item: any) => (
					<OrderLine
						key={item.id}
						item={item}
						currencyCode={cart.region?.currency_code || 'vnd'}
					/>
				))}
				<Divider className="my-2" />
				<DisplayTotal
					currency={cart.region?.currency_code || 'vnd'}
					totalAmount={cart.subtotal ?? 0}
					totalTitle={'Tạm tính'}
				/>
				<DisplayTotal
					currency={cart.region?.currency_code || 'vnd'}
					totalAmount={cart.shipping_total ?? 0}
					totalTitle={'Vận chuyển'}
				/>
				<DisplayTotal
					currency={cart.region?.currency_code || 'vnd'}
					totalAmount={cart.tax_total ?? 0}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={cart.region?.currency_code || 'vnd'}
					totalAmount={cart.total ?? 0}
					totalTitle={'Tổng tiền'}
				/>
			</div>
		</Card>
		<DraftOrderEditModal
			state={editState}
			onClose={closeEdit}
			draftOrderId={dorder.id}
			cartItems={cartItems as any}
			currencyCode={cart.region?.currency_code ?? 'vnd'}
			regionId={cart.region_id ?? ''}
			customerId={cart.customer_id ?? ''}
		/>
		</>
	);
};

export default Summary;
