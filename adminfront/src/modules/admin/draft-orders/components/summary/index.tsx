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
		<DraftOrderEditModal
			state={editState}
			onClose={closeEdit}
			draftOrderId={dorder.id}
			cartItems={(dorder.cart?.items as any) ?? []}
			currencyCode={dorder.cart?.region?.currency_code ?? 'vnd'}
			regionId={dorder.cart?.region_id ?? ''}
			customerId={dorder.cart?.customer_id ?? ''}
		/>
		</>
	);
};

export default Summary;
