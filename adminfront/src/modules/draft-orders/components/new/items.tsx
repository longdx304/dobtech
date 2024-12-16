import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { extractUnitPrice } from '@/utils/prices';
import { ProductVariant, Region } from '@medusajs/medusa';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import _ from 'lodash';
import { Search } from 'lucide-react';
import { useAdminVariants } from 'medusa-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import productsColumns from './product-columns';

const PAGE_SIZE = 10;

interface VariantQuantity {
	variantId: string;
	quantity: number;
}

export interface VariantPrice {
	variantId: string;
	unit_price: number;
	currency_code: string;
	isCustom: boolean;
}

const Items = () => {
	const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
	const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>(
		[]
	);
	const [variantQuantities, setVariantQuantities] = useState<VariantQuantity[]>(
		[]
	);
	const [variantPrices, setVariantPrices] = useState<VariantPrice[]>([]);

	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const {
		context: { region, items, setItems },
		form,
	} = useNewDraftOrderForm();
	const { enableNext, disableNext } = useStepModal();

	const { isLoading, count, variants } = useAdminVariants({
		q: searchValue,
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
		region_id: region?.id,
		customer_id: form.getFieldValue('customer_id'),
	});

	const { variants: newVariants = [] } = useAdminVariants({
		id: selectedVariantIds,
		region_id: region?.id,
	});

	// Get priced variant by id
	const getPricedVariant = (variantId: string) => {
		return variants?.find((v) => v.id === variantId);
	};

	const handleRowSelectionChange = (
		selectedRowKeys: React.Key[],
		selectedRows: ProductVariant[]
	) => {
		setSelectedVariantIds(selectedRowKeys as string[]);
		setSelectedVariants(selectedRows as ProductVariant[]);

		// Initialize quantities for newly selected variants
		const newQuantities = selectedRows.map((variant) => ({
			variantId: variant.id,
			quantity: 1,
		}));

		// Preserve existing quantities for previously selected variants
		const updatedQuantities = newQuantities.map((newQuant) => {
			const existing = variantQuantities.find(
				(q) => q.variantId === newQuant.variantId
			);
			return existing || newQuant;
		});

		setVariantQuantities(updatedQuantities);

		// Wait for pricedVariants to be available before updating form items
		if (newVariants?.length > 0) {
			updateFormItems(selectedRows, updatedQuantities);
		}
	};

	// Update form items when pricedVariants are available
	useEffect(() => {
		if (selectedVariants.length > 0 && newVariants?.length > 0) {
			updateFormItems(selectedVariants, variantQuantities, variantPrices);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newVariants]);

	const updateFormItems = (
		variants: ProductVariant[],
		quantities: VariantQuantity[],
		variantPrices?: VariantPrice[]
	) => {
		const formItems = variants.map((variant) => {
			const pricedVariant = getPricedVariant(variant.id) as PricedVariant;

			return {
				quantity:
					quantities.find((q) => q.variantId === variant.id)?.quantity || 1,
				variant_id: variant.id,
				title: variant.title as string,
				unit_price: pricedVariant
					? extractUnitPrice(pricedVariant, region as Region, false)
					: 0,
				product_title: (variant.product as any)?.title,
				thumbnail: (variant.product as any)?.thumbnail,
			};
		});

		setItems(formItems);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		if (selectedVariants.length > 0) {
			enableNext();
		} else {
			disableNext();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedVariants]);

	// Handle quantity changes
	const handleQuantityChange = (value: number, variantId: string) => {
		setVariantQuantities((prev) => {
			const updated = prev.map((q) =>
				q.variantId === variantId ? { ...q, quantity: value } : q
			);
			return updated;
		});

		setItems((prevItems) => {
			return prevItems.map((item) =>
				item.variant_id === variantId ? { ...item, quantity: value } : item
			);
		});
	};

	// Get default price for a variant
	const getDefaultPrice = (variantId: string) => {
		const variant = variants?.find((v) => v.id === variantId);

		if (!variant) {
			return {
				amount: 0,
				currency_code: region?.currency_code || 'vnd',
			};
		}

		// If calculated_price_type is override or sale, use calculated_price
		// Otherwise use original_price
		const priceAmount =
			variant.calculated_price_type === 'override' ||
			variant.calculated_price_type === 'sale'
				? variant.calculated_price
				: variant.original_price;

		return {
			amount: priceAmount ?? 0,
			currency_code: region?.currency_code || 'vnd',
		};
	};

	// Get price for a variant (custom or default)
	const getVariantPrice = (variantId: string): VariantPrice => {
		const savedPrice = variantPrices.find((p) => p.variantId === variantId);

		// Return custom price if it exists
		if (savedPrice?.isCustom) {
			return savedPrice;
		}

		// Get default price
		const defaultPrice = getDefaultPrice(variantId);
		return {
			variantId,
			unit_price: defaultPrice.amount,
			currency_code: defaultPrice.currency_code,
			isCustom: false,
		};
	};

	// Handle price changes with currency
	const handlePriceChange = (
		variantId: string,
		value: number,
		currency: string
	) => {
		setVariantPrices((prev) => {
			const updated = prev.map((p) =>
				p.variantId === variantId
					? { ...p, unit_price: value, currency_code: currency, isCustom: true }
					: p
			);

			// Add new price if it doesn't exist
			if (!prev.some((p) => p.variantId === variantId)) {
				updated.push({
					variantId,
					unit_price: value,
					currency_code: currency,
					isCustom: true,
				});
			}

			return updated;
		});

		// Only update form items if variant is selected
		if (selectedVariantIds.includes(variantId)) {
			setItems((prevItems) =>
				prevItems.map((item) =>
					item.variant_id === variantId
						? {
								...item,
								unit_price: value,
								currency_code: currency,
						  }
						: item
				)
			);
		}
	};

	const columns = productsColumns({
		currency: region?.currency_code,
		handleQuantityChange,
		handlePriceChange,
		getQuantity: (variantId: string) =>
			variantQuantities.find((q) => q.variantId === variantId)?.quantity ?? 1,
		getVariantPrice,
		isVariantSelected: (variantId: string) =>
			selectedVariantIds.includes(variantId),
	});

	const handleDisable = (record: any) => {
		if (record?.inventory_quantity || record?.original_price_incl_tax) {
			return false;
		}
		return true;
	};

	return (
		<>
			<Flex
				align="center"
				justify="flex-end"
				className="p-4 border-0 border-b border-solid border-gray-200"
			>
				<Input
					placeholder="Nhập tên sản phẩm"
					className="w-[200px] text-xs"
					size="small"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
				/>
			</Flex>
			<Table
				rowSelection={{
					selectedRowKeys: selectedVariantIds,
					onChange: handleRowSelectionChange as any,
					preserveSelectedRowKeys: true,
					getCheckboxProps: (record: any) => ({
						disabled: handleDisable(record),
					}),
				}}
				loading={isLoading}
				columns={columns as any}
				dataSource={variants ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} biến thể sản phẩm`,
				}}
			/>
		</>
	);
};

export default Items;
