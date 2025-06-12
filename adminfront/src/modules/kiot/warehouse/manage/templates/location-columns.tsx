import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { WarehouseKiot, WarehouseKiotInventory } from '@/types/kiot';
import { Minus, Pen, Plus, Trash2 } from 'lucide-react';

export interface WarehouseDataType {}

interface Props {
	handleRemoveWarehouse: (id: string) => void;
	handleEditWarehouse: (item: WarehouseKiot) => void;
}

const warehouseColumns = ({
	handleEditWarehouse,
	handleRemoveWarehouse,
}: Props) => [
	{
		title: 'Vị trí',
		key: 'location',
		dataIndex: 'location',
		className: 'text-xs',
		fixed: 'left',
		render: (_: WarehouseKiot['location']) => {
			return _;
		},
	},
	{
		title: 'Hiện có (sản phẩm)',
		key: 'inventories',
		dataIndex: 'inventories',
		className: 'text-xs text-center text-bold',
		render: (_: WarehouseKiot['inventories']) => {
			return _?.length ?? 0;
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: WarehouseKiot) => {
			const actions = [
				{
					label: 'Thêm sản phẩm',
					icon: <Pen size={20} />,
					onClick: () => {
						handleEditWarehouse(record);
					},
				},
				{
					label: 'Xoá vị trí',
					icon: <Trash2 size={20} />,
					danger: true,
					onClick: () => {
						handleRemoveWarehouse(record.id);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

interface ExpandedColumnsProps {
	handleAddInventory: (record: WarehouseKiotInventory) => void;
	handleRemoveInventory: (record: WarehouseKiotInventory) => void;
}

const expandedColumns = ({
	handleAddInventory,
	handleRemoveInventory,
}: ExpandedColumnsProps) => [
	{
		title: 'Sản phẩm',
		key: 'title',
		dataIndex: 'sku',
		className: 'text-xs',
		fixed: 'left',
		render: (_: WarehouseKiotInventory) => {
			return (
				<Flex className="flex items-center gap-3">
					<Flex vertical className="">
						<Tooltip title={`${_}`}>
							<Text className="text-xs line-clamp-2">{`${_}`}</Text>
						</Tooltip>
					</Flex>
				</Flex>
			);
		},
	},
	{
		title: 'Số lượng kho',
		key: 'quantity',
		dataIndex: 'quantity',
		className: 'text-xs',
		render: (
			_: WarehouseKiotInventory['quantity'],
			record: WarehouseKiotInventory
		) => {
			const quantity = _ / record.item_unit.quantity;
			return `${quantity} ${record.item_unit.unit} (${_} đôi)`;
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: WarehouseKiotInventory) => {
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

export { expandedColumns, warehouseColumns };
