'use client';
import React, { PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useAdminItemUnits } from '../hooks/api/item-unit';
import { ItemUnit } from '@/types/item-unit';

export enum ProductUnit {
	PRODUCT_CATEGORIES = 'product_categories',
	INVENTORY = 'inventoryService',
}

type ProductUnitContextType = {
	item_units: ItemUnit[];
	optionItemUnits?: { value: string; label: string }[];
	defaultUnit: string;
	selectedUnit: string | null;
	quantity: number;
	setSelectedUnit: (unitId: string) => void;
	setQuantity: (quantity: number) => void;
	getSelectedUnitData: () => { unitId: string; quantity: number } | null;
};

const defaultProductUnitContext: ProductUnitContextType = {
	item_units: [],
	optionItemUnits: [],
	defaultUnit: 'đôi',
	selectedUnit: null,
	quantity: 0,
	setSelectedUnit: () => {},
	setQuantity: () => {},
	getSelectedUnitData: () => null,
};

const ProductUnitContext = React.createContext(defaultProductUnitContext);

export const ProductUnitProvider = ({ children }: PropsWithChildren) => {
	const { item_units } = useAdminItemUnits();
	const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
	const [quantity, setQuantity] = useState<number>(0);

	const optionItemUnits = useMemo(() => {
		if (!item_units) return [];
		return item_units.map((item) => ({
			value: item.id,
			label: item.unit,
		}));
	}, [item_units]);

	const defaultUnit =
		item_units?.find((item) => item.unit === 'đôi')?.id ?? 'đôi';

	const getSelectedUnitData = () => {
		if (selectedUnit && quantity > 0) {
			return {
				unitId: selectedUnit,
				quantity: quantity,
			};
		}
		return null;
	};
	return (
		<ProductUnitContext.Provider
			value={{
				item_units: item_units ?? [],
				optionItemUnits,
				defaultUnit,
				selectedUnit,
				quantity,
				setSelectedUnit,
				setQuantity,
				getSelectedUnitData,
			}}
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
