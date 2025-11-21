'use client';
import { Col, Row } from 'antd';
import { useAdminDraftSupplierOrder } from '@/lib/hooks/api/draft-sorders';
import BackToSupplierDorders from '../../components/back-to-dsorders';
import Information from '../../components/information';
import CustomerInfo from '../../components/customer-info';
import Summary from '../../components/summary';

interface Props {
	id: string;
}

export default function SupplierDraftOrderDetail({ id }: Readonly<Props>) {
	const { draft_supplier_order, isLoading, refetch } =
		useAdminDraftSupplierOrder(id);

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
