'use client';
import { Col, Row, Spin, Alert } from 'antd';
import { useAdminDraftSupplierOrder } from '@/lib/hooks/api/draft-sorders';
import BackToSupplierDorders from '../../components/back-to-dsorders';
import Information from '../../components/information';
import CustomerInfo from '../../components/customer-info';
import Summary from '../../components/summary';

interface Props {
	id: string;
}

export default function SupplierDraftOrderDetail({ id }: Readonly<Props>) {
	const { draft_supplier_order, isLoading, isError, error } =
		useAdminDraftSupplierOrder(
			id,
			{
				expand: 'cart,cart.items,cart.items.variant,cart.items.variant.product,supplier,region,user',
			},
			{
				enabled: !!id,
			}
		);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	if (isError) {
		return (
			<Row gutter={[16, 16]} className="mb-12">
				<Col span={24}>
					<BackToSupplierDorders />
				</Col>
				<Col span={24}>
					<Alert
						message="Lỗi"
						description={
							error?.message ||
							'Không thể tải thông tin bản nháp đơn đặt hàng'
						}
						type="error"
						showIcon
					/>
				</Col>
			</Row>
		);
	}

	if (!draft_supplier_order) {
		return (
			<Row gutter={[16, 16]} className="mb-12">
				<Col span={24}>
					<BackToSupplierDorders />
				</Col>
				<Col span={24}>
					<Alert
						message="Không tìm thấy"
						description="Không tìm thấy bản nháp đơn đặt hàng"
						type="warning"
						showIcon
					/>
				</Col>
			</Row>
		);
	}

	return (
		<Row gutter={[16, 16]} className="mb-12">
			<Col span={24}>
				<BackToSupplierDorders />
			</Col>
			<Col xs={24} lg={24} className="flex flex-col gap-y-4">
				<Information dorder={draft_supplier_order} isLoading={isLoading} />
				<Summary dorder={draft_supplier_order} isLoading={isLoading} />
				<CustomerInfo dorder={draft_supplier_order} isLoading={isLoading} />
			</Col>
		</Row>
	);
}
