import { getCustomer } from '@/actions/customer';
import Overview from '@/modules/user/components/overview';
import LoginTemplate from '@/modules/user/templates/login-template';
import { Metadata } from 'next';
import { LOGIN_VIEW } from '@/types/auth';

export const metadata: Metadata = {
	title: 'SYNA | Trang cá nhân',
	description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
	const customer = await getCustomer().catch(() => null);

	return customer ? (
		<Overview />
	) : (
		<LoginTemplate initialView={LOGIN_VIEW.SIGN_IN} />
	);
}
