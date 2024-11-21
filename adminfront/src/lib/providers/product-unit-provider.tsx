'use client';
import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { useAdminItemUnits } from '../hooks/api/item-unit';
import { ItemUnit } from '@/types/item-unit';

export enum ProductUnit {
	PRODUCT_CATEGORIES = 'product_categories',
	INVENTORY = 'inventoryService',
}

const defaultProductUnitContext: {
	item_units: ItemUnit[];
	optionItemUnits?: { value: string; label: string }[];
	defaultUnit: string;
} = {
	item_units: [],
	optionItemUnits: [],
	defaultUnit: 'đôi',
};

const ProductUnitContext = React.createContext(defaultProductUnitContext);

export const ProductUnitProvider = ({ children }: PropsWithChildren) => {
	const { item_units } = useAdminItemUnits();

	const optionItemUnits = useMemo(() => {
		if (!item_units) return [];
		return item_units.map((item) => ({
			value: item.id,
			label: item.unit,
		}));
	}, [item_units]);

	const defaultUnit =
		item_units?.find((item) => item.unit === 'đôi')?.id ?? 'đôi';

	return (
		<ProductUnitContext.Provider
			value={{ item_units: item_units ?? [], optionItemUnits, defaultUnit }}
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
