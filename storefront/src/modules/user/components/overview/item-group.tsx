'use client';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { LOGIN_VIEW } from '@/types/auth';
import { Divider } from 'antd';
import {
	Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoginTemplate from '../../templates/login-template';

const ItemGroup = () => {
	const { state, onOpen, onClose } = useToggleState(false);
	const router = useRouter();
	const { customer } = useCustomer();

	const handleLoginClick = () => {
		if (!customer) {
			onOpen();
		}
	};

	const onCloseDrawer = () => {
		router.refresh();
		onClose();
	};

	return (
		<>
			{/* Login / Register */}
			<Flex className="flex-col space-y-2">
				<Flex
					align="center"
					justify="space-between"
					className="px-4 py-2"
					onClick={() => {
						handleLoginClick();
					}}
				>
					<Text className="text-lg font-semibold">
						{customer
							? `Chào, ${customer.first_name} ${customer.last_name}`
							: 'Đăng nhập / Đăng ký'}
					</Text>
					<Settings
						size={24}
						className="block lg:hidden"
						onClick={() => router.push('/user/setting')}
					/>
				</Flex>
			</Flex>

			<Divider
				className="my-0 block lg:hidden"
				style={{ borderColor: '#f6f6f6', borderWidth: '11px' }}
			/>

			<Drawer
				open={state}
				placement="bottom"
				onClose={onClose}
				styles={{
					header: { borderBottom: 'none' },
					wrapper: { height: '100%' },
				}}
			>
				<LoginTemplate
					initialView={LOGIN_VIEW.SIGN_IN}
					onCloseDrawer={onCloseDrawer}
				/>
			</Drawer>
		</>
	);
};

export default ItemGroup;
