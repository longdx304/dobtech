'use client';
import useToggleState from '@/lib/hooks/use-toggle-state';

import React, { PropsWithChildren, useContext, useState } from 'react';

type SupplierOrderEditContextType = {
	showModal: () => void;
	hideModal: () => void;
	isModalVisible: boolean;
	activeOrderEditId?: string | undefined;
	setActiveOrderEditId: (id: string | undefined) => void;
};

const defaultSupplierOrderEditContext: SupplierOrderEditContextType = {
	showModal: () => {},
	hideModal: () => {},
	isModalVisible: false,
	activeOrderEditId: undefined,
	setActiveOrderEditId: () => {},
};

const SupplierOrderEditContext = React.createContext(
	defaultSupplierOrderEditContext
);

type SupplierOrderEditProviderProps = PropsWithChildren<{ orderId: string }>;

export const SupplierOrderEditProvider = ({
	children,
	orderId,
}: SupplierOrderEditProviderProps) => {
	const {
		state: isModalVisible,
		onOpen,
		onClose: hideModal,
	} = useToggleState(false);

	const [activeOrderEditId, setActiveOrderEditId] = useState<
		string | undefined
	>(undefined);

	const handleOpenModal = async () => {
		setActiveOrderEditId(orderId);
		onOpen();
	};

	return (
		<SupplierOrderEditContext.Provider
			value={{
				showModal: handleOpenModal,
				hideModal,
				isModalVisible,
				activeOrderEditId,
				setActiveOrderEditId,
			}}
		>
			{children}
		</SupplierOrderEditContext.Provider>
	);
};

export const useSupplierOrderEdit = () => {
	const context = useContext(SupplierOrderEditContext);
	if (context === undefined) {
		throw new Error(
			'useSupplierOrderEdit must be used within a SupplierOrderEditProvider'
		);
	}
	return context;
};
