'use client';
import { ProductCollection } from '@medusajs/medusa';
import { Modal, message } from 'antd';
import { CircleAlert, Plus } from 'lucide-react';
import {
	useAdminCollections,
	useAdminDeleteCollection,
	useMedusa,
} from 'medusa-react';
import { FC, useMemo, useState } from 'react';

import { FloatButton } from '@/components/Button';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { getErrorMessage } from '@/lib/utils';
import {
	AddProductModal,
	CollectionModal,
	ManageProductModal,
} from '@/modules/products/components/collection-modal';
import { DataType } from '../collection-modal/AddProductModal';
import collectionColumns from './CollectionColumn';

type Props = {};

const DEFAULT_PAGE_SIZE = 15;

const CollectionList: FC<Props> = ({}) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const {
		state: stateProduct,
		onOpen: onOpenProduct,
		onClose: onCloseProduct,
	} = useToggleState(false);

	const {
		state: stateAddProduct,
		onOpen: onOpenAddProduct,
		onClose: onCloseAddProduct,
	} = useToggleState(false);

	const { client } = useMedusa();
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentCollection, setCurrentCollection] = useState<any>(null);
	const [collectionId, setCollectionId] = useState<string>('');
	const limit = DEFAULT_PAGE_SIZE;
	const deleteCollection = useAdminDeleteCollection(collectionId);
	const { collections, isLoading, isRefetching, count } = useAdminCollections(
		{
			q: '',
			limit: 10,
			offset: offset,
		},
		{
			keepPreviousData: true,
		}
	);

	// manage and add product modal

	const handleEditCollection = (data: ProductCollection) => {
		setCurrentCollection(data);
		onOpen();
	};

	const handleProductCollection = (data: ProductCollection) => {
		setCurrentCollection(data);
		onOpenProduct();
	};

	const handleAddProduct = (data: ProductCollection) => {
		setCurrentCollection(data);
		onOpenAddProduct();
	};

	const handleDeleteCollection = (collectionId: ProductCollection['id']) => {
		setCollectionId(collectionId);
		if (collectionId) {
			Modal.confirm({
				title: 'Bạn có muốn xoá bộ sưu tập này không ?',
				content:
					'Bộ sưu tập sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá bộ sưu tập này chứ?',
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
					deleteCollection.mutateAsync(void 0, {
						onSuccess: () => {
							message.success('Xóa bộ sưu tập thành công.');
							setCollectionId(''); 
							return;
						},
						onError: (error) => {
							message.error(getErrorMessage(error));
							return;
						},
					});
				},
				// confirmLoading: deleteCollection.isLoading,
				onCancel() {
					setCollectionId('');
				},
			});
		}
	};

	const handleCloseModal = () => {
		setCurrentCollection(null);
		onClose();
	};

	const handleCloseProduct = () => {
		setCurrentCollection(null);
		onCloseProduct();
	};

	const handleCloseAddProduct = () => {
		setCurrentCollection(null);
		onCloseAddProduct();
	};

	const columns = useMemo(() => {
		return collectionColumns({
			handleEditCollection,
			handleDeleteCollection,
			handleProductCollection,
			handleAddProduct,
		});
	}, [collections]);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * limit);
	};

	const handleAddProducts = async (
		addedIds: string[],
		removedIds: string[]
	) => {
		try {
			if (addedIds.length > 0) {
				await client.admin.collections.addProducts(currentCollection?.id, {
					product_ids: addedIds,
				});
			}

			if (removedIds.length > 0) {
				await client.admin.collections.removeProducts(currentCollection?.id, {
					product_ids: removedIds,
				});
			}
		} catch (error) {
			message.error('Thêm sản phẩm vào bộ sưu tập thất bại!');
		}
	};

	return (
		<>
			<Table
				loading={isLoading || isRefetching}
				columns={columns as any}
				dataSource={collections ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: Math.floor(count ?? 0 / (limit ?? 0)),
					pageSize: limit,
					current: numPages || 1,
					onChange: handleChangePage,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} />}
				type="primary"
				onClick={onOpen}
				// data-testid="btnCreateProduct"
			/>
			<CollectionModal
				state={state}
				handleOk={onClose}
				handleCancel={handleCloseModal}
				collection={currentCollection}
			/>
			<AddProductModal
				state={stateAddProduct}
				handleOk={onCloseAddProduct}
				onSubmit={handleAddProducts}
				handleCancel={handleCloseAddProduct}
				collection={currentCollection}
				// selectedProducts={selectedProducts}
				// setSelectedProducts={setSelectedProducts}
			/>
			{currentCollection && (
				<ManageProductModal
					state={stateProduct}
					handleOk={onCloseProduct}
					handleCancel={handleCloseProduct}
					collection={currentCollection}
				/>
			)}
		</>
	);
};

export default CollectionList;
