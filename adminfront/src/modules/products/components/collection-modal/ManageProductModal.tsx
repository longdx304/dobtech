import { ProductCollection } from '@medusajs/medusa';
import { TableColumnsType } from 'antd';
import { Dot, Trash2 } from 'lucide-react';
import { FC } from 'react';

import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { useAdminProducts } from 'medusa-react';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	collection: ProductCollection | null;
};

interface DataType {
	key: React.Key;
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
	{
		title: 'Action',
		key: 'action',
		render: (text: any, record: any) => (
			<div className="cursor-pointer">
				<Trash2 />
			</div>
		),
	},
];

const ManageProductModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	collection,
}) => {
	const { products } = useAdminProducts({
		q: '',
		limit: 10,
		collection_id: [collection?.id ?? ''],
		offset: 0,
	});

	const handleSelectedProduct = () => {};

	// Generate unique keys for each product
	const productData = products
		? (products as any).map((product: { id: any }, index: any) => ({
				...product,
				key: product.id || index,
		  }))
		: [];

	return (
		<Modal
			title={'Quản lý sản phẩm'}
			open={state}
			handleOk={handleSelectedProduct}
			handleCancel={handleCancel}
		>
			<Table columns={columns} dataSource={productData} />
		</Modal>
	);
};

export default ManageProductModal;
