import { ProductCollection } from '@medusajs/medusa';
import { TableColumnsType } from 'antd';
import { Dot } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import {
	useAdminCreateCollection,
	useAdminProducts,
	useMedusa,
} from 'medusa-react';

type Props = {
	state: boolean;
	// handleOk: () => void;
	handleOk: (selectedProducts: DataType[]) => void;
	handleCancel: () => void;
	collection: ProductCollection | null;
	// selectedProducts: DataType[];
	// setSelectedProducts: (selectedProducts: DataType[]) => void;
	onSubmit: (selectedIds: string[], removedIds: string[]) => void;
};

export interface DataType {
	key: React.Key;
	id: string;
	title: string;
	status: string;
}

const columns: TableColumnsType<DataType> = [
	{
		title: 'Sản phẩm',
		dataIndex: 'title',
		render: (text: string, record: any) => (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{record.thumbnail && (
					<img
						src={record.thumbnail}
						alt={text}
						style={{ width: 30, height: 40, marginRight: 8 }}
					/>
				)}
				<a>{text}</a>
			</div>
		),
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		render: (status: string) => (
			<div className="flex justify-center">
				<Dot color={status === 'published' ? '#47B881' : '#E74C3C'} />
				<span>{status}</span>
			</div>
		),
	},
];

const AddProductModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	collection,
	// selectedProducts,
	// setSelectedProducts,
	onSubmit,
}) => {
	const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
		'checkbox'
	);

	const { client } = useMedusa();
	// State to manage selected rows in the table
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
	const [removedProducts, setRemovedProducts] = useState<DataType[]>([]);

	const { products, isLoading, refetch } = useAdminProducts({
		q: '',
		limit: 10,
		offset: 0,
	});

	// Generate unique keys for each product
	const productData = products
		? (products as any).map((product: { id: any }, index: any) => ({
				...product,
				key: product.id || index,
		  }))
		: [];

	const handleRowSelectionChange = (
		selectedRowKeys: React.Key[],
		selectedRows: DataType[]
	) => {
		setSelectedRowKeys(selectedRowKeys);
		setSelectedRows(selectedRows);
	};

	// useEffect(() => {
	// 	setSelectedProducts(selectedRows);

	// 	setRemovedProducts((prev) => {
	// 		const removed = prev.filter(
	// 			(product) => !selectedRowKeys.includes(product.key)
	// 		);
	// 		return removed;
	// 	});
	// }, [selectedProducts]);

	const handleSubmit = async () => {
		onSubmit(
			selectedRowKeys.map((product) => product as string),
			removedProducts.map((product) => product.id as string)
		);
	};

	console.log('selectedProducts', selectedRowKeys);

	// Reset selected rows when modal is closed
	// Compare with the inil product in collection
	useEffect(() => {
		if (state && collection) {
			const initialSelectedKeys = collection.products.map(
				(product: any) => product.id
			);
			const initialSelectedRows = collection.products.map((product: any) => ({
				key: product.key,
				id: product.id,
				title: product.title,
				status: product.status,
				thumbnail: product.thumbnail,
			}));
			setSelectedRowKeys(initialSelectedKeys);
			setSelectedRows(initialSelectedRows);
		}
	}, [state, collection]);

	// console.log('collection', collection)
	return (
		<Modal
			title={'Thêm sản phẩm'}
			open={state}
			handleOk={handleSubmit}
			handleCancel={handleCancel}
		>
			<Table
				rowSelection={{
					type: selectionType,
					selectedRowKeys: selectedRowKeys,
					onChange: handleRowSelectionChange,
				}}
				loading={isLoading}
				columns={columns}
				dataSource={productData}
			/>
		</Modal>
	);
};

export default AddProductModal;
