'use client';

import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import { User } from '@medusajs/medusa';
import { useAdminGetSession } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { removeCookie } from '@/actions/auth';
import { ERoutes } from '@/types/routes';

type UserContextType = {
	user: Omit<User, 'password_hash'> | null;
	isLoading: boolean;
	remote: () => void;
};
const defaultUserContext: UserContextType = {
	user: null,
	isLoading: false,
	remote: () => {},
};

const UserContext = React.createContext(defaultUserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const { user, isLoading, remove, isError, error } = useAdminGetSession();
	
	// Redirect to login if there is an error
	if (isError) {
		removeCookie();
		router.push(ERoutes.LOGIN);
		return;
	}

	return (
		<UserContext.Provider value={{ user, isLoading, remove }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
