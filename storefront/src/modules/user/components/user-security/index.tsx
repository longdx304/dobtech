'use client';
import { useCustomer } from '@/lib/providers/user/user-provider';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { ERoutes } from '@/types/routes';
import UserSecurityDesktop from './UserSecurityDesktop';
import UserSecurityMobile from './UserSecurityMobile';

const UserSecurity = () => {
	const { customer } = useCustomer();
	const isDesktop = useIsDesktop();

	const data = [
		{
			title: 'E-mail',
			value: customer?.email,
			href: ERoutes.USER_SETTING_EMAIL,
			modalType: 'email',
		},
		{
			title: 'Họ tên',
			value: `${customer?.first_name} ${customer?.last_name}`,
			href: ERoutes.USER_SETTING_NAME,
			modalType: 'name',
		},
		{
			title: 'Số điện thoại',
			value: customer?.phone,
			href: ERoutes.USER_SETTING_PHONE,
			modalType: 'phone',
		},
		{
			title: 'Đổi mật khẩu',
			value: '*******',
			href: ERoutes.USER_SETTING_PASSWORD,
			modalType: 'password',
		},
	];

	return isDesktop ? (
		<UserSecurityDesktop data={data} />
	) : (
		<UserSecurityMobile data={data} />
	);
};

export default UserSecurity;
