'use client';

import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { LOGIN_VIEW } from '@/types/auth';
import { useState } from 'react';
import Login from '../components/login';
import Register from '../components/register';

type LoginTemplateProps = {
	onCloseDrawer?: () => void;
	initialView?: LOGIN_VIEW;
};

const LoginTemplate = ({ onCloseDrawer, initialView }: LoginTemplateProps) => {
	const [currentView, setCurrentView] = useState(initialView);
	const isDesktop = useIsDesktop();

	return (
		<>
			{currentView === LOGIN_VIEW.SIGN_IN ? (
				<Login
					setCurrentView={setCurrentView}
					onCloseDrawer={onCloseDrawer}
					isDesktop={isDesktop}
				/>
			) : (
				<Register
					setCurrentView={setCurrentView}
					onCloseDrawer={onCloseDrawer}
					isDesktop={isDesktop}
				/>
			)}
		</>
	);
};

export default LoginTemplate;
