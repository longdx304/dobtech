import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Table } from '@/components/Table';
import { Tabs } from '@/components/Tabs';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { ProductModal } from '@/modules/admin/products/components/products-modal';
import { Product, Region } from '@medusajs/medusa';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { Col, Row, TabsProps } from 'antd';
import _ from 'lodash';
import { Plus, Search } from 'lucide-react';
import {
	useAdminCollections,
	useAdminProductCategories,
	useAdminVariants,
} from 'medusa-react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ItemPrice, ItemQuantity } from '..';
import productColumns from './product-columns';

type ProductFormProps = {
	selectedProducts: string[];
	setSelectedProducts: (products: string[]) => void;
	setSelectedRowsProducts: (products: any) => void;
	itemQuantities: ItemQuantity[];
	itemPrices: ItemPrice[];
	setItemQuantities: React.Dispatch<React.SetStateAction<ItemQuantity[]>>;
	setItemPrices: React.Dispatch<React.SetStateAction<ItemPrice[]>>;
	regions: Region[] | undefined;
	regionId: string | null;
	setRegionId: (regionId: string) => void;
};
const PAGE_SIZE = 10;

const ProductForm: FC<ProductFormProps> = ({
	selectedProducts,
	setSelectedProducts,
	setSelectedRowsProducts,
	itemQuantities,
	itemPrices,
	setItemQuantities,
	setItemPrices,
	regions,
	regionId,
	setRegionId,
}) => {
	const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [activeTab, setActiveTab] = useState<string>('list');
	const { state, onOpen, onClose } = useToggleState(false);

	// Separate query to fetch selected variants
	const { variants: selectedVariantsData, count: countVariant } =
		useAdminVariants(
			{
				id: selectedProducts,
				limit: selectedProducts?.length || 0,
			},
			{
				enabled: !!selectedProducts?.length,
				keepPreviousData: true,
			}
		);

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		const keys = selectedRowKeys as string[];

		setItemQuantities((prevQuantities) => {
			const filtered = prevQuantities.filter((item) =>
				keys.includes(item.variantId)
			);
			const byId = new Map(filtered.map((item) => [item.variantId, item]));
			return keys.map(
				(id) => byId.get(id) ?? { variantId: id, quantity: 1 }
			);
		});

		setItemPrices((prevPrices) => {
			const filtered = prevPrices.filter((item) => keys.includes(item.variantId));
			const byId = new Map(filtered.map((item) => [item.variantId, item]));
			return keys.map((id) => {
				const existing = byId.get(id);
				if (existing !== undefined) {
					return existing;
				}
				const selectedVariant = variants?.find((v) => v.id === id);
				const fromList = (selectedVariant as any)?.supplier_price ?? 0;
				return { variantId: id, unit_price: fromList };
			});
		});

		setSelectedProducts(keys);
	};

	useEffect(() => {
		if (selectedVariantsData?.length)
			setSelectedRowsProducts(selectedVariantsData as PricedVariant[]);
		//eslint-disable-next-line
	}, [selectedVariantsData]);

	// Keep quantity/price state aligned with selection and API-loaded variants.
	// Fixes: off-page selections (no row in current `variants`), and UI showing
	// supplier_price while `itemPrices` had no entry until the user edits.
	useEffect(() => {
		if (!selectedProducts.length) {
			return;
		}

		setItemQuantities((prev) => {
			const byId = new Map(prev.map((x) => [x.variantId, x]));
			const next = selectedProducts.map(
				(id) => byId.get(id) ?? { variantId: id, quantity: 1 }
			);
			const same =
				next.length === prev.length &&
				next.every(
					(item, i) =>
						prev[i]?.variantId === item.variantId &&
						prev[i]?.quantity === item.quantity
				);
			return same ? prev : next;
		});

		setItemPrices((prev) => {
			const byId = new Map(prev.map((x) => [x.variantId, x]));
			const next: ItemPrice[] = selectedProducts.map((id) => {
				const existing = byId.get(id);
				if (existing !== undefined) {
					return existing;
				}
				const variant = selectedVariantsData?.find((v) => v.id === id);
				const supplier = (variant as any)?.supplier_price ?? 0;
				return { variantId: id, unit_price: supplier };
			});
			if (
				next.length === prev.length &&
				next.every(
					(item, i) =>
						prev[i]?.variantId === item.variantId &&
						prev[i]?.unit_price === item.unit_price
				)
			) {
				return prev;
			}
			return next;
		});
	}, [selectedProducts, selectedVariantsData]);

	const handleChangeDebounce = _.debounce(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const { variants, count, isLoading } = useAdminVariants({
		q: searchValue,
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
	});

	const { product_categories } = useAdminProductCategories(
		{
			parent_category_id: 'null',
			include_descendants_tree: true,
			is_internal: false,
		},
		{ enabled: !regionId, keepPreviousData: true }
	);
	const { collections } = useAdminCollections(
		{ limit: 10, offset: 0 },
		{ enabled: !regionId, keepPreviousData: true }
	);

	// set item prices
	const handlePriceChange = (value: number | null, variantId: string) => {
		setItemPrices((prevPrices) => {
			const existingItemIndex = prevPrices.findIndex(
				(item) => item.variantId === variantId
			);

			if (existingItemIndex !== -1) {
				const updatedPrices = [...prevPrices];
				updatedPrices[existingItemIndex] = {
					...updatedPrices[existingItemIndex],
					unit_price: value ?? 0,
				};
				return updatedPrices;
			} else {
				return [...prevPrices, { variantId, unit_price: value ?? 0 }];
			}
		});
	};

	const handleQuantityChange = (value: number, variantId: string) => {
		setItemQuantities((prevQuantities) => {
			const existingItemIndex = prevQuantities.findIndex(
				(item) => item.variantId === variantId
			);

			if (existingItemIndex !== -1) {
				const updatedQuantities = [...prevQuantities];
				updatedQuantities[existingItemIndex] = {
					...updatedQuantities[existingItemIndex],
					quantity: Math.max(0, value),
				};
				return updatedQuantities;
			} else {
				return [...prevQuantities, { variantId, quantity: Math.max(0, value) }];
			}
		});
	};

	const columns = useMemo(
		() =>
			productColumns({
				itemQuantities,
				itemPrices,
				handlePriceChange,
				handleQuantityChange,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[itemQuantities, itemPrices]
	);

	const handleCloseModal = () => {
		setCurrentProduct(null);
		onClose();
	};

	// handle region change
	const handleRegionChange = (value: string) => {
		setRegionId(value);
	};

	// get default value region by name
	const defaultRegion = regions?.find((region) => region.name === 'Vietnam');

	// set default region
	useEffect(() => {
		if (defaultRegion) {
			setRegionId(defaultRegion.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultRegion]);

	const itemTabs: TabsProps['items'] = [
		{
			key: 'list',
			label: 'Danh sách',
		},
		{
			key: 'checked',
			label: 'Đã chọn',
		},
	];
	const handleTabChange = (key: string) => {
		setActiveTab(key);
	};

	return (
		<Row gutter={[16, 16]} className="pt-4">
			<Col span={24}>
				<Flex
					align="center"
					justify="space-between"
					className="p-4 border-0 border-b border-solid border-gray-200"
				>
					<Title level={4} className="">
						Chọn sản phẩm
					</Title>
					<Button
						icon={<Plus color="white" size={20} />}
						type="primary"
						onClick={onOpen}
						shape="circle"
						data-testid="btnCreateProduct"
					/>
				</Flex>
				{/* Add more product  */}
				{product_categories && collections && (
					<ProductModal
						type="supplier"
						state={state}
						handleOk={onClose}
						handleCancel={handleCloseModal}
						product={currentProduct}
						productCategories={product_categories}
						productCollections={collections}
					/>
				)}
			</Col>
			<Col span={18}>
				<Input
					placeholder="Nhập tên sản phẩm"
					className="w-full text-xs"
					size="small"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
				/>
			</Col>
			<Col span={6}>
				{defaultRegion && (
					<Select
						placeholder="Chọn khu vực"
						onChange={handleRegionChange}
						options={regions?.map((region) => ({
							label: region.name,
							value: region.id,
						}))}
						value={regionId}
						className="w-full"
					/>
				)}
			</Col>
			<Col span={24} id="table-product">
				<div className="flex justify-center">
					<Tabs items={itemTabs} onChange={handleTabChange} />
				</div>
				<div className="flex justify-end">{`Đã chọn : ${
					countVariant ?? 0
				} biến thể`}</div>
				<Table
					loading={isLoading}
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys: selectedProducts,
						onChange: handleRowSelectionChange,
						preserveSelectedRowKeys: true,
					}}
					columns={columns as any}
					dataSource={
						(activeTab === 'list' ? variants : selectedVariantsData) ?? []
					}
					rowKey="id"
					pagination={
						activeTab === 'list'
							? {
									total: count,
									pageSize: PAGE_SIZE,
									current: currentPage,
									onChange: handleChangePage,
									showSizeChanger: false,
							  }
							: false
					}
					scroll={{ x: 700 }}
				/>
			</Col>
		</Row>
	);
};

export default ProductForm;
