import DashboardTemplate from '@/modules/admin/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Trung tâm vận hành',
	description: 'Tổng quan vận hành kho và đơn hàng',
};

export default function DashboardPage() {
	return <DashboardTemplate />;
}
