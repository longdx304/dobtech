import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { removeCookie } from '@/actions/auth';
import {
	ADMIN_ACCESS_PROFILE_REFRESH_EVENT,
	AccessPermission,
} from '@/lib/access-control';
import {
	UserPasswordModal,
	UserProfileModal,
} from '@/modules/common/components/user-account';
import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';
import { useAdminDeleteSession, useMedusa } from 'medusa-react';
import { menuItems, menuRoutes } from './MenuItem';

interface Props {
	user: Omit<User, 'password_hash'>;
	className?: string;
	remove: () => void;
	onClose?: () => void;
}

const Menubar = ({ user, remove, className, onClose = () => {} }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const { client } = useMedusa();
	const [, contextHolder] = message.useMessage();
	const { mutateAsync } = useAdminDeleteSession();
	const [profileOpen, setProfileOpen] = useState(false);
	const [passwordOpen, setPasswordOpen] = useState(false);
	const [pagePermissions, setPagePermissions] = useState<AccessPermission[]>();
	const [accessProfileVersion, setAccessProfileVersion] = useState(0);

	useEffect(() => {
		const refreshAccessProfile = () =>
			setAccessProfileVersion((version) => version + 1);
		window.addEventListener(
			ADMIN_ACCESS_PROFILE_REFRESH_EVENT,
			refreshAccessProfile
		);
		return () =>
			window.removeEventListener(
				ADMIN_ACCESS_PROFILE_REFRESH_EVENT,
				refreshAccessProfile
			);
	}, []);

	useEffect(() => {
		if (!user || user.role === 'admin') return;
		const controller = new AbortController();
		client.admin.custom
			.get('/admin/me/access', undefined, undefined, {
				signal: controller.signal,
			})
			.then((profile) => {
				if (profile?.page_permissions) {
					setPagePermissions(profile.page_permissions);
				}
			})
			.catch(() => {});
		return () => controller.abort();
	}, [accessProfileVersion, client, pathname, user?.id, user?.role]);

	const handleClickMenu: MenuProps['onClick'] = (e) => {
		const { key } = e;
		if (menuRoutes[key]) {
			router.push(menuRoutes[key]);
			onClose();
			return;
		}
	};

	const logOut = useCallback(async () => {
		mutateAsync(undefined, {
			onSuccess: async () => {
				remove();
				await removeCookie();
				router.push(ERoutes.LOGIN);
			},
			onError: () => {
				message.error('Đăng xuất thất bại!');
			},
		});
	}, [mutateAsync, remove, router]);

	const handleDropdownClick = useCallback(
		(e: { key: string }) => {
			const { key } = e;
			if (key === 'logout') {
				logOut();
			} else if (key === 'profile') {
				setProfileOpen(true);
			} else if (key === 'change-password') {
				setPasswordOpen(true);
			}
		},
		[logOut]
	);

	const _menuItems = useMemo(
		() => menuItems(user, handleDropdownClick, pagePermissions),
		[user, handleDropdownClick, pagePermissions]
	);

	const profileUser = {
		first_name: user.first_name,
		last_name: user.last_name,
		phone: (user as { phone?: string | null }).phone ?? null,
	};

	return (
		<>
			{contextHolder}
			<Menu
				className={className}
				onClick={handleClickMenu}
				mode="inline"
				items={_menuItems as any}
			/>
			<UserProfileModal
				open={profileOpen}
				onClose={() => setProfileOpen(false)}
				user={profileUser}
			/>
			<UserPasswordModal
				open={passwordOpen}
				onClose={() => setPasswordOpen(false)}
			/>
		</>
	);
};

export default Menubar;
