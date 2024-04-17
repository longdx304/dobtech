import { PackageSearch, Pencil, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IProductResponse } from '@/types/products';
import { Product } from '@medusajs/medusa';

interface Props {
	handleDeleteProduct: (userId: Product['id']) => void;
	handleEditProduct: (record: IProductResponse) => void;
}
const productsColumns = ({ handleDeleteProduct, handleEditProduct }: Props) => [
	{
		title: 'Thông tin',
		key: 'information',
		render: (_: any, record: any) => (
			<Flex vertical gap="small" className="flex flex-row items-center">
				<Avatar icon={<PackageSearch />} />
				<Text strong>{record.title}</Text>
			</Flex>
		),
	},
	{
		title: 'Giá bán',
		dataIndex: 'price',
		key: 'price',
		render: (_: any, record: any) => (
			<Flex vertical gap="small">
				<Text
					strong
					className="text-sm"
				>{`$${record.variants[0].prices[0].amount}`}</Text>
			</Flex>
		),
	},
	{
		title: 'Action',
		key: 'action',
		width: 40,
		render: (_: any, record: any) => (
			<Flex>
				<Button
					onClick={() => handleEditProduct(record)}
					type="text"
					shape="circle"
					icon={<Pencil />}
				/>
				<Button
					onClick={() => handleDeleteProduct(record.id)}
					type="text"
					shape="circle"
					icon={<X color="red" />}
				/>
			</Flex>
		),
	},
];

export default productsColumns;
