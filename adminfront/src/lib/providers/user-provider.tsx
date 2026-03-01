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
	user: Omit<User, 'password_hash'> | undefined;
	isLoading: boolean;
	remove: () => void;
};
const defaultUserContext: UserContextType = {
	user: undefined,
	isLoading: false,
	remove: () => {},
};

const UserContext = React.createContext(defaultUserContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const { user, isLoading, remove, isError, error } = useAdminGetSession();
	const [logoutAttempted, setLogoutAttempted] = useState(false);

	useEffect(() => {
		if (isError && !logoutAttempted) {
			// Only logout for authentication errors, not network errors
			const errorObj = error as any;
			const isAuthError = errorObj?.response?.status === 401 ||
			                    errorObj?.response?.status === 403 ||
			                    errorObj?.status === 401 ||
			                    errorObj?.status === 403;

			const errorMessage = errorObj?.message || '';
			const isNetworkError = errorMessage.includes('fetch') ||
			                       errorMessage.includes('network') ||
			                       errorMessage.includes('Failed to fetch');

			if (isAuthError) {
				// Legitimate auth error - logout
				console.warn('Authentication error, logging out:', error);
				setLogoutAttempted(true);
				removeCookie();
				router.push(ERoutes.LOGIN);
			} else if (!isNetworkError) {
				// Other error (not network) - log but don't logout
				console.warn('Session check error (not logging out):', error);
			}
			// Network errors: do nothing, let retry logic handle it
		}
	}, [isError, error, logoutAttempted, router]);

	// Don't block rendering during transient errors
	if (isError && !logoutAttempted) {
		return <>{children}</>;
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
