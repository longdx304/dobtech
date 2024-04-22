'use client';
import { CircleAlert, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import productsColumns from './products-column';
import { ProductModal } from '../products-modal';
import { Product } from '@medusajs/medusa';
import { TResponse } from '@/types/common';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { updateSearchQuery } from '@/lib/utils';
import { IProductResponse } from '@/types/products';
import { Modal, message } from 'antd';
import { deleteProduct } from '@/actions/products';

interface Props {
	data: TResponse<IProductResponse> | null;
}

const ProductList = ({ data }: Props) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const currentPage = searchParams.get('page') ?? 1;

	const { state, onOpen, onClose } = useToggleState(false);
	const [currentProduct, setCurrentProduct] = useState<IProductResponse | null>(
		null
	);

	const handleEditProduct = (record: IProductResponse) => {
		setCurrentProduct(record);
		onOpen();
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
					message.success('Xoá nhân viên thành công!');
				} catch (error) {
					message.error('Xoá nhân viên thất bại!');
				}
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const columns = useMemo(
		() => productsColumns({ handleDeleteProduct, handleEditProduct }),
		[data]
	);

	const handleChangePage = (page: number) => {
		// create new search params with new value
		const newSearchParams = updateSearchQuery(searchParams, {
			page: page.toString(),
		});

		// Replace url
		router.replace(`${pathname}?${newSearchParams}`);
	};

	console.log('data', data);

	return (
		<Card className="w-full">
			<Table
				columns={columns}
				dataSource={data?.data ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(data?.count ?? 0 / (data?.limit ?? 0)),
					pageSize: data?.limit,
					current: currentPage as number,
					onChange: handleChangePage,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
			/>
			<ProductModal
				state={state}
				handleOk={onClose}
				handleCancel={handleCloseModal}
				product={currentProduct}
			/>
		</Card>
	);
};

export default ProductList;
