'use client';

import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { ERoutes } from '@/types/routes';
import { Button, List } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '../../actions';
import LoginTemplate from '../../templates/login-template';

const UserSetting = () => {
	const { customer } = useCustomer();
	const router = useRouter();
	const {
		state: isLoginOpen,
		onOpen: onLoginOpen,
		onClose: onLoginClose,
	} = useToggleState(false);

	const {
		state: isLogoutOpen,
		onOpen: onLogoutOpen,
		onClose: onLogoutClose,
	} = useToggleState(false);

	const data = [
		{
			title: 'Quản lý tài khoản của tôi',
			href: ERoutes.USER_SETTING_SECURITY,
		},
		{
			title: 'Sổ địa chỉ',
			href: ERoutes.USER_ADDRESSBOOK,
		},
		{ title: 'Đơn hàng của tôi', href: ERoutes.USER_ORDERS },
	];

	const handleLogout = async () => {
		await signOut();
		router.back();
	};

	const handleLoginClick = () => {
		if (!customer) {
			onLoginOpen();
		}
	};

	return (
		<Flex
			justify="space-between"
			className="flex-col min-h-[98vh] bg-[#f6f6f6]"
		>
			<div className="user-setting bg-white">
				<Flex
					align="center"
					justify="space-between"
					style={{ borderBottom: '11px solid #f6f6f6' }}
					className="pb-2"
				>
					<div className="flex" onClick={() => router.back()}>
						<ChevronLeft size={24} className="text-[#767676] pl-[12px]" />
					</div>
					<Text className="font-bold text-center">Cài đặt</Text>
					<div className="w-[36px]" />
				</Flex>

				<Flex
					className="flex-col p-2"
					style={{ borderBottom: '11px solid #f6f6f6' }}
					onClick={() => {
						handleLoginClick();
					}}
				>
					<Flex align="center" justify="space-between" className="px-4 py-2">
						<Text className="text-lg font-semibold">
							{customer
								? `Chào, ${customer.first_name} ${customer.last_name}`
								: 'Đăng nhập / Đăng ký'}
						</Text>
					</Flex>
				</Flex>

				<Flex
					className="flex-col"
					style={{ borderBottom: '11px solid #f6f6f6' }}
				>
					<Flex
						align="center"
						justify="space-between"
						className="px-4 pt-4 pb-2"
						onClick={() => {
							handleLoginClick();
						}}
					>
						<Text className="text-md font-bold">Cài đặt</Text>
					</Flex>
					<List
						itemLayout="horizontal"
						dataSource={data}
						className="px-4 mt-0"
						renderItem={(item) => (
							<LocalizedClientLink href={item.href}>
								<List.Item
									style={{ borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)' }}
									onClick={(e) => {
										if (!customer) {
											e.preventDefault();
											onLoginOpen();
										}
									}}
								>
									<Flex justify="space-between" className="w-full">
										<Text className="text-sm">{item.title}</Text>
										<ChevronRight size={16} className="text-[#767676]" />
									</Flex>
								</List.Item>
							</LocalizedClientLink>
						)}
					/>
				</Flex>
			</div>

			{customer && (
				<Flex justify="center" className="pt-4 pb-8">
					<Button
						type="default"
						className="flex items-center justify-center w-full rounded-none text-lg text-rose-700 px-4 py-6 font-bold border-none"
						onClick={onLogoutOpen}
					>
						Đăng xuất
					</Button>
				</Flex>
			)}

			{/* Drawer Login */}
			<Drawer
				open={isLoginOpen}
				placement="bottom"
				onClose={onLoginClose}
				styles={{
					header: { borderBottom: 'none' },
					wrapper: { height: '100%' },
				}}
			>
				<LoginTemplate onCloseDrawer={onLoginClose} />
			</Drawer>

			{/* Drawer Logout */}
			<Drawer
				title="Bạn có chắc chắn muốn đăng xuất?"
				placement="bottom"
				open={isLogoutOpen}
				onClose={onLogoutClose}
				closeIcon={false}
				className="[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center"
				styles={{
					wrapper: { height: '160px' },
					body: { padding: '0' },
				}}
			>
				<div className="bg-[#f6f6f6] text-[14px] text-[#222]">
					<p
						className="bg-white px-3 py-4 m-0 text-center"
						onClick={handleLogout}
					>
						Đăng xuất
					</p>
					<p
						className="bg-white px-3 pt-4 m-0 text-center"
						style={{ borderTop: '8px solid #f6f6f6' }}
						onClick={onLogoutClose}
					>
						Hủy
					</p>
				</div>
			</Drawer>
		</Flex>
	);
};

export default UserSetting;
