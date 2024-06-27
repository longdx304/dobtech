import { Metadata } from 'next';

import Overview from '@/modules/user/components/overview';

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Trang cá nhân',
	description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
	return <Overview />;
}
