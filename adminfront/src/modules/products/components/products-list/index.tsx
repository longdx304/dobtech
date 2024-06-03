'use client';

import { Product } from '@medusajs/medusa';
import { Modal, message, notification } from 'antd';
import _ from 'lodash';
import { CircleAlert, Plus, Search, CloudUpload, Download } from 'lucide-react';
import {
	useAdminCollections,
	useAdminProductCategories,
	useAdminProducts,
	useMedusa,
	useAdminCreateBatchJob,
} from 'medusa-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';

import { deleteProduct } from '@/actions/products';
import { FloatButton } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { Button } from '@/components/Button';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { ProductModal } from '../products-modal';
import productsColumns from './products-column';
import { ERoutes } from '@/types/routes';
import { getErrorMessage } from '@/lib/utils';
import { usePolling } from '@/lib/providers/polling-provider';
import ImportModal from './import-modal';
const PAGE_SIZE = 10;

interface Props {}

const ProductList = ({}: Props) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState(false);
	const {
		state: stateImport,
		onOpen: onOpenImport,
		onClose: onCloseImport,
	} = useToggleState(false);
	const { resetInterval } = usePolling();

	const [currentPage, setCurrentPage] = useState(1);
	const [searchValue, setSearchValue] = useState('');
	const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

	const createBatchJob = useAdminCreateBatchJob();
	const { products, isLoading, count, isRefetching, refetch } =
		useAdminProducts({
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
		router.push(`${ERoutes.PRODUCTS}/${record.id}`);
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

	const handleCreateExport = () => {
		const reqObj = {
			type: 'product-export',
			context: {},
			dry_run: false,
		};

		createBatchJob.mutate(reqObj, {
			onSuccess: () => {
				resetInterval();
				message.success('Khởi tạo file xuất sản phẩm thành công!');
			},
			onError: (err) => {
				message.error(getErrorMessage(err));
			},
		});
	};

	return (
		<>
			<Flex align="center" justify="flex-start" className="">
				<Title level={3} className="text-start">
					Quản lý sản phẩm
				</Title>
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
			<Flex align="center" justify="flex-end" gap="small" className="pb-4">
				<Button
					type="default"
					icon={<CloudUpload size={18} />}
					className="flex items-center text-sm h-[34px]"
					onClick={onOpenImport}
				>
					{'Nhập file sản phẩm'}
				</Button>
				<Button
					type="default"
					icon={<Download size={18} />}
					className="flex items-center text-sm h-[34px]"
					onClick={handleCreateExport}
					loading={createBatchJob?.isLoading}
				>
					{'Xuất file sản phẩm'}
				</Button>
			</Flex>
			<Table
				loading={
					isLoading ||
					isRefetching ||
					isLoadingCategories ||
					isLoadingCollections
				}
				columns={columns as any}
				dataSource={products ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
					showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} sản phẩm`,
				}}
				scroll={{ x: 700 }}
			/>
			<FloatButton
				// className="absolute"
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
			<ImportModal
				state={stateImport}
				handleOk={onCloseImport}
				handleCancel={onCloseImport}
			/>
		</>
	);
};

export default ProductList;
