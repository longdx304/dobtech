'use client';

import { Customer } from '@medusajs/medusa';
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

interface CustomerContextProps {
	customer: Omit<Customer, 'password_hash'> | null;
	setCustomer: React.Dispatch<
		React.SetStateAction<Omit<Customer, 'password_hash'> | null>
	>;
}

const CustomerContext = createContext<CustomerContextProps | undefined>(
	undefined
);

interface CustomerProviderProps {
	children: ReactNode;
	initialCustomer: Omit<Customer, 'password_hash'> | null;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
	children,
	initialCustomer,
}) => {
	const [customer, setCustomer] = useState<Omit<
		Customer,
		'password_hash'
	> | null>(initialCustomer);

	useEffect(() => {
		// Fetch customer data from the server
		setCustomer(initialCustomer);
	}, [initialCustomer]);

	return (
		<CustomerContext.Provider value={{ customer, setCustomer }}>
			{children}
		</CustomerContext.Provider>
	);
};

export const useCustomer = (): CustomerContextProps => {
	const context = useContext(CustomerContext);
	if (context === undefined) {
		throw new Error('useCustomer must be used within a CustomerProvider');
	}
	return context;
};
