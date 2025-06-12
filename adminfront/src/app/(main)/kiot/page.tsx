import DashboardTemplate from '@/modules/kiot/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard',
};

export default function KiotPage() {
	return <DashboardTemplate />;
}
