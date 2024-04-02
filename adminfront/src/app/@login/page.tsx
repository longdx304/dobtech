import { Metadata } from 'next';
import LoginTemplate from '@/modules/account/components/login';


export const metadata: Metadata = {
	title: 'Sign in',
	description: 'Sign in to your Admin account.',
};

export default function Login() {
	return <LoginTemplate />;
}
