'use client';
import { FC, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { Plus, CircleAlert } from 'lucide-react';
import { useAdminCollections, useAdminDeleteCollection } from 'medusa-react';
import { ProductCollection } from '@medusajs/medusa';

import { Card } from '@/components/Card';
import { FloatButton } from '@/components/Button';
import collectionColumns from './CollectionColumn';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { CollectionModal, ManageProductModal } from '@/modules/products/components/collection-modal';
import { getErrorMessage } from '@/lib/utils';

type Props = {};

const DEFAULT_PAGE_SIZE = 15;

const CollectionList: FC<Props> = ({}) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const {
		state: stateProduct,
		onOpen: onOpenProduct,
		onClose: onCloseProduct,
	} = useToggleState(false);

	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentCollection, setCurrentCollection] = useState<any>(null);
	const [collectionId, setCollectionId] = useState<string>(null);
	const limit = DEFAULT_PAGE_SIZE;
	const deleteCollection = useAdminDeleteCollection(collectionId);
	const { collections, isLoading, isRefetching, count } = useAdminCollections(
		{
			q: '',
			limit: 10,
			offset: 0,
		},
		{
			keepPreviousData: true,
		}
	);

	const handleEditCollection = (data: ProductCollection) => {
		setCurrentCollection(data);
		onOpen();
	};

	const handleProductCollection = (data: ProductCollection) => {
		setCurrentCollection(data);
		onOpenProduct();
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
							return;
						},
						onError: (error) => {
							message.error(getErrorMessage(error));
							return;
						},
					});
				},
				confirmLoading: deleteCollection.isLoading,
				onCancel() {
					console.log('Cancel');
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

	const columns = useMemo(() => {
		return collectionColumns({
			handleEditCollection,
			handleDeleteCollection,
			handleProductCollection,
		});
	}, [collections]);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * limit);
	};

	return (
		<>
			<Table
				loading={isLoading || isRefetching}
				columns={columns}
				dataSource={collections ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: Math.floor(count ?? 0 / (limit ?? 0)),
					pageSize: limit,
					current: numPages || 1,
					// onChange: handleChangePage,
				}}
			/>
			<FloatButton
				className="fixed"
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
			<ManageProductModal
				state={stateProduct}
				handleOk={onCloseProduct}
				handleCancel={handleCloseProduct}
				collection={currentCollection}
			/>
		</>
	);
};

export default CollectionList;
