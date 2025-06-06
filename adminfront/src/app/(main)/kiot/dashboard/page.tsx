import DashboardTemplate from '@/modules/admin/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard',
};

export default function DashboardPage() {
	return <DashboardTemplate />;
}
