'use client';

import { CircleAlert, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
	useAdminProducts,
	useAdminProductCategories,
	useAdminCollections,
} from 'medusa-react';
import { Product } from '@medusajs/medusa';
import { Modal, message } from 'antd';
import _ from 'lodash';
import { useRouter } from 'next/navigation';

import { deleteProduct } from '@/actions/products';
import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { updateSearchQuery } from '@/lib/utils';
import { TResponse } from '@/types/common';
import { ProductModal } from '../products-modal';
import productsColumns from './products-column';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';

const PAGE_SIZE = 10;

interface Props {}

const ProductList = ({}: Props) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [searchValue, setSearchValue] = useState('');
	const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

	const { products, isLoading, count, isRefetching } = useAdminProducts({
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
		q: searchValue || undefined,
	});

	const { product_categories, isLoading: isLoadingCategories } =
		useAdminProductCategories({
			parent_category_id: 'null',
			include_descendants_tree: true,
			is_internal: false,
		});
	const { collections, isLoading: isLoadingCollections } =
		useAdminCollections();

	const handleEditProduct = (record: Product) => {
		router.push(`/products/${record.id}`);
	};

	const handleCloseModal = () => {
		setCurrentProduct(null);
		onClose();
	};

	const handleDeleteProduct = (productId: Product['id']) => {
		Modal.confirm({
			title: 'Bạn có muốn xoá sản phẩm này không ?',
			content:
				'Sản phẩm sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá sản phẩm này chứ?',

			icon: (
				<CircleAlert
					style={{ width: 32, height: 24 }}
					className="mr-2"
					color="#E7B008"
				/>
			),
			okType: 'danger',
			okText: 'Đồng ý',
			cancelText: 'Huỷ',
			async onOk() {
				try {
					await deleteProduct(productId);
					message.success('Xoá sản phẩm thành công!');
				} catch (error) {
					message.error('Xoá sản phẩm thất bại!');
				}
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const columns = useMemo(
		() => productsColumns({ handleDeleteProduct, handleEditProduct }),
		[products]
	);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;

			// Update search query
			setSearchValue(inputValue);
		},
		500
	);

	return (
		<>
			<Flex align="center" justify="flex-start" className="">
				<Title level={3} className="text-start">Quản lý sản phẩm</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					placeholder="Tìm kiếm sản phẩm..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={
					isLoading ||
					isRefetching ||
					isLoadingCategories ||
					isLoadingCollections
				}
				columns={columns}
				dataSource={products ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
				}}
				scroll={{ x: 700 }}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} />}
				type="primary"
				onClick={onOpen}
				data-testid="btnCreateProduct"
			/>
			{product_categories && collections && (
				<ProductModal
					state={state}
					handleOk={onClose}
					handleCancel={handleCloseModal}
					product={currentProduct}
					productCategories={product_categories}
					productCollections={collections}
				/>
			)}
		</>
	);
};

export default ProductList;
