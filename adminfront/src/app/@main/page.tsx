import { Metadata } from 'next';
import LoginTemplate from '@/modules/account/components/login';

export const metadata: Metadata = {
	title: 'Admin Dashboard',
	description: 'Admin Page',
};

export default function Main() {
	return <div className="h-[2000px]">123</div>;
}