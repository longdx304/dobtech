import LoginTemplate from '@/modules/admin/account/components/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Đăng nhập | DOB Warehouse',
	description: 'Đăng nhập hệ thống quản lý kho DOB Warehouse.',
};

export default function Login() {
	return <LoginTemplate />;
}
