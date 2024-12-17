import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { ProductVariant, Region } from '@medusajs/medusa';
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
	amount?: number;
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

	// Get default price for a variant
	const getDefaultPrice = (variant: any) => {
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

	/**
	 * Handle row selection change.
	 *
	 * Updates the state with the new selected variants and their quantities.
	 * If the priced variants are available, it also updates the form items.
	 *
	 * @param {React.Key[]} selectedRowKeys - The keys of the selected rows.
	 * @param {ProductVariant[]} selectedRows - The selected rows.
	 */
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

		// Initialize prices for newly selected variants
		const newPrices = selectedRows.map((variant) => ({
			variantId: variant.id,
			unit_price: getDefaultPrice(variant).amount,
		}));

		// Preserve existing prices for previously selected variants
		const updatedPrices = newPrices.map((newPrice) => {
			const existing = variantPrices.find(
				(p) => p.variantId === newPrice.variantId
			);
			return existing || newPrice;
		});

		setVariantPrices(updatedPrices);

		// Wait for pricedVariants to be available before updating form items
		// if (newVariants?.length > 0) {
		updateFormItems(selectedRows, updatedQuantities, updatedPrices);
		// }
	};

	const updateFormItems = (
		variants: ProductVariant[],
		quantities: VariantQuantity[],
		prices?: VariantPrice[]
	) => {
		const formItems = variants.map((variant) => {
			const selectedQuantity =
				quantities.find((q) => q.variantId === variant.id)?.quantity || 1;

			const selectedPrice =
				prices?.find((p) => p.variantId === variant.id)?.unit_price || 0;

			return {
				quantity: selectedQuantity,
				unit_price: selectedPrice,
				variant_id: variant.id,
				title: variant?.title as string,
				product_title: variant?.product?.title,
				thumbnail: variant?.product?.thumbnail,
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

	// Handle page change
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

	// Handle price changes
	const handlePriceChange = (
		variantId: string,
		value: number,
		currency: string
	) => {
		setVariantPrices((prev) => {
			const updated = prev.map((p) =>
				p.variantId === variantId
					? { ...p, unit_price: value, currency_code: currency }
					: p
			);
			return updated;
		});

		setItems((prevItems) => {
			return prevItems.map((item) =>
				item.variant_id === variantId ? { ...item, unit_price: value } : item
			);
		});
	};

	const getVariantPrice = (variant: any, region: Region) => {
		if (
			variant.calculated_price_type === 'override' ||
			variant.calculated_price_type === 'sale'
		) {
			return variant.calculated_price ?? 0;
		}

		// If original_price exists, use it
		if (variant.original_price) {
			return variant.original_price;
		}

		let price = variant?.prices?.find(
			(p: any) =>
				p.currency_code.toLowerCase() === region?.currency_code?.toLowerCase()
		);

		return price?.amount || 0;
	};

	const columns = productsColumns({
		currency: region?.currency_code,
		// edit quantity
		getQuantity: (variantId: string) =>
			variantQuantities.find((q) => q.variantId === variantId)?.quantity ?? 1,
		handleQuantityChange,
		// edit price
		getPrice: (variantId: string) => {
			const variant = variants?.find((v) => v.id === variantId);
			const customPrice = variantPrices.find(
				(p) => p.variantId === variantId
			)?.unit_price;

			return customPrice && customPrice !== 0
				? customPrice
				: variant
				? getVariantPrice(variant, region as Region)
				: 0;
		},
		handlePriceChange,
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
