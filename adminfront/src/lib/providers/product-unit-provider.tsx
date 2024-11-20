'use client';
import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useAdminGetSession, useAdminStore } from 'medusa-react';

export enum ProductUnit {
	PRODUCT_CATEGORIES = 'product_categories',
	INVENTORY = 'inventoryService',
}

const defaultProductUnitContext: {
	featureToggleList: Record<string, boolean>;
	isFeatureEnabled: (flag: string) => boolean;
} = {
	featureToggleList: {},
	isFeatureEnabled: function (flag): boolean {
		return !!this?.featureToggleList[flag] || false;
	},
};

const ProductUnitContext = React.createContext(defaultProductUnitContext);

export const ProductUnitProvider = ({ children }: PropsWithChildren) => {
	const { user, isLoading } = useAdminGetSession();

	const [featureFlags, setProductUnits] = useState<
		{ key: string; value: boolean }[]
	>([]);

	const { store, isFetching } = useAdminStore();

	useEffect(() => {
		if (
			isFetching ||
			!store ||
			(!user && !isLoading) ||
			!store['feature_flags']?.length
		) {
			return;
		}

		setProductUnits([
			...(store['feature_flags'] as { key: string; value: boolean }[]),
			...store['modules'].map((module) => ({
				key: module.module,
				value: true,
			})),
		]);
	}, [isFetching, store, user, isLoading]);

	const featureToggleList = featureFlags.reduce(
		(acc, flag) => ({ ...acc, [flag.key]: flag.value }),
		{} as Record<string, boolean>
	);

	const isFeatureEnabled = (flag: string) => !!featureToggleList[flag];

	return (
		<ProductUnitContext.Provider
			value={{ isFeatureEnabled, featureToggleList }}
		>
			{children}
		</ProductUnitContext.Provider>
	);
};

export const useProductUnit = () => {
	const context = useContext(ProductUnitContext);

	if (!context) {
		throw new Error('useProductUnit must be used within a ProductUnitProvider');
	}

	return context;
};
