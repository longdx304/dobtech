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
						<span
							onClick={() => router.push(`/${ERoutes.USER}`)}
							data-testid="nav-account-link"
						>
							{customer.first_name} {customer.last_name}
						</span>
					),
					icon: <User />,
				},
				{
					key: 'dropdown-2',
					label: (
						<span onClick={() => router.push(`/${ERoutes.USER_ORDERS}`)}>
							Đơn hàng của tôi
						</span>
					),
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
						<span
							onClick={() => router.push(`/${ERoutes.AUTH}`)}
							data-testid="nav-account-link"
						>
							Đăng nhập / đăng kí
						</span>
					),
					icon: <User />,
				},
		  ];

	const menu = { items, onClick: handleClickMenu };

	return (
		<Dropdown menu={menu}>
			<Button
				icon={
					<User
						className="stroke-2"
						color="#767676"
						data-testid="nav-account-dropdown"
					/>
				}
				shape="circle"
				type="text"
				aria-label="User Information"
			/>
		</Dropdown>
	);
};

export default UserInformation;
