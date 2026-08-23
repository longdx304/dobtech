import { Flex } from '@/components/Flex';
import OperationsReport from '@/modules/admin/operations-report/templates/operations-report';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Báo cáo vận hành',
	description: 'Báo cáo đơn hàng đã xuất MISA',
};

export default function OperationsReportPage() {
	return <Flex vertical gap="middle" className="h-full w-full"><OperationsReport /></Flex>;
}
