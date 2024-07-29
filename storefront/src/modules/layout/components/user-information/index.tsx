'use client';
import { Button } from '@/components/Button';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { signOut } from '@/modules/user/actions';
import { ERoutes } from '@/types/routes';
import { Dropdown, MenuProps } from 'antd';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserInformation = () => {
	const { customer } = useCustomer();
	const router = useRouter();

	const handleLogout = async () => {
		await signOut();
		router.push(ERoutes.DASHBOARD);
	};

	const handleClickMenu: MenuProps['onClick'] = (e) => {
		const { key } = e;
		if (key === 'logout') {
			handleLogout();
			return;
		}
	};

	const items: MenuProps['items'] = customer
		? [
				{
					key: 'dropdown-1',
					label: (
						<a href={`/${ERoutes.USER}`}>
							{customer.first_name} {customer.last_name}
						</a>
					),
					icon: <User />,
				},
				{
					key: 'dropdown-2',
					label: <a href={`/${ERoutes.USER_ORDERS}`}>Đơn hàng của tôi</a>,
				},
				{
					type: 'divider',
				},
				{
					key: 'logout',
					danger: true,
					label: <span onClick={handleLogout}>Đăng xuất</span>,
				},
		  ]
		: [
				{
					key: 'dropdown-1',
					label: (
						<a rel="noopener noreferrer" href="/user/auth">
							Đăng nhập / đăng kí
						</a>
					),
					icon: <User />,
				},
		  ];

	const menu = { items, onClick: handleClickMenu };

	return (
		<Dropdown menu={menu}>
			<Button
				icon={<User className="stroke-2" color="#767676" />}
				shape="circle"
				type="text"
			/>
		</Dropdown>
	);
};

export default UserInformation;
