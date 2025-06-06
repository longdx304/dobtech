import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { WarehouseKiotBySku, WarehouseKiotRecord } from '@/types/kiot';
import { ProductVariant } from '@/types/products';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import { Minus, Pen, Plus, Trash2 } from 'lucide-react';

export interface WarehouseDataType {}

interface Props {
	handleEditWarehouse: (item: WarehouseKiotBySku) => void;
}

const productColumns = ({ handleEditWarehouse }: Props) => [
	{
		title: 'Sản phẩm',
		key: 'sku',
		className: 'text-xs',
		fixed: 'left',
		render: (_: WarehouseKiotBySku) => {
			return (
				<Flex className="flex items-center gap-3">
					{/* <Image
						src={_?.product?.thumbnail ?? '/images/product-img.png'}
						alt="Product variant Thumbnail"
						width={30}
						height={40}
						className="rounded-md cursor-pointer"
					/> */}
					<Flex vertical className="">
						<Tooltip title={`${_?.sku}`}>
							<Text className="text-xs line-clamp-2">{`${_?.sku}`}</Text>
						</Tooltip>
					</Flex>
				</Flex>
			);
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: WarehouseKiotBySku) => {
			const actions = [
				{
					label: 'Thêm vị trí vào',
					icon: <Pen size={20} />,
					onClick: () => {
						handleEditWarehouse(record);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

interface ExpandedColumnsProps {
	handleAddInventory: (record: WarehouseKiotRecord) => void;
	handleRemoveInventory: (record: WarehouseKiotRecord) => void;
}

const expandedColumns = ({
	handleAddInventory,
	handleRemoveInventory,
}: ExpandedColumnsProps) => [
	{
		title: 'Vị trí',
		key: 'warehouse',
		dataIndex: 'warehouse',
		className: 'text-xs',
		width: 200,
		fixed: 'left',
		render: (_: WarehouseKiotRecord['warehouse']) => {
			return (
				<Tooltip title={`${_?.location}`}>
					<Text className="text-xs line-clamp-2">{`${_?.location}`}</Text>
				</Tooltip>
			);
		},
	},
	{
		title: 'Số lượng kho',
		key: 'quantity',
		dataIndex: 'quantity',
		className: 'text-xs',
		render: (
			_: WarehouseKiotRecord['quantity'],
			record: WarehouseKiotRecord
		) => {
			const quantity = _ / record.unit.quantity;
			return `${quantity} ${record.unit.unit} (${_} đôi)`;
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: WarehouseKiotRecord) => {
			return (
				<Flex>
					<Minus
						onClick={() => handleRemoveInventory(record)}
						size={18}
						color="red"
						className="cursor-pointer"
					/>
					<Plus
						onClick={() => handleAddInventory(record)}
						size={18}
						color="green"
						className="cursor-pointer"
					/>
				</Flex>
			);
		},
	},
];

export { productColumns, expandedColumns };
