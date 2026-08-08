import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { ProductVariant } from '@/types/products';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import { Minus, Pen, Plus, Trash2 } from 'lucide-react';
import {
	formatInventoryQuantity,
	getInventoryUnitIssue,
} from '../../utils/inventory-display';

export interface WarehouseDataType {}

interface Props {
	handleRemoveWarehouse: (id: string) => void;
	handleEditWarehouse: (item: Warehouse) => void;
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
		render: (_: Warehouse['location']) => {
			return _;
		},
	},
	{
		title: 'Hiện có (sản phẩm)',
		key: 'inventories',
		dataIndex: 'inventories',
		className: 'text-xs text-center text-bold',
		render: (_: Warehouse['inventories']) => {
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
		render: (_: any, record: Warehouse) => {
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
	handleAddInventory: (record: WarehouseInventory) => void;
	handleRemoveInventory: (record: WarehouseInventory) => void;
}

const expandedColumns = ({
	handleAddInventory,
	handleRemoveInventory,
}: ExpandedColumnsProps) => [
	{
		title: 'Sản phẩm',
		key: 'title',
		dataIndex: 'variant',
		className: 'text-xs',
		fixed: 'left',
		render: (_: ProductVariant | null) => {
			const productName = _?.product?.title || 'Sản phẩm không còn tồn tại';
			const variantName = _?.title || 'Biến thể không xác định';

			return (
				<Flex className="flex items-center gap-3">
					<Image
						src={_?.product?.thumbnail ?? '/images/product-img.png'}
						alt="Product variant Thumbnail"
						width={30}
						height={40}
						className="rounded-md cursor-pointer"
					/>
					<Flex vertical className="">
						<Tooltip title={`${productName} - ${variantName}`}>
							<Text className="text-xs line-clamp-2">{`${productName} - ${variantName}`}</Text>
						</Tooltip>
						<span className="text-gray-500">{variantName}</span>
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
		render: (_: WarehouseInventory['quantity'], record: WarehouseInventory) => {
			const issue = getInventoryUnitIssue(record);
			const value = formatInventoryQuantity(record);

			return issue ? (
				<Tooltip title={`${issue}. Vui lòng cập nhật lại đơn vị cho tồn kho này.`}>
					<Text className="text-xs text-amber-600">{value}</Text>
				</Tooltip>
			) : (
				value
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
		render: (_: any, record: WarehouseInventory) => {
			const issue = getInventoryUnitIssue(record);
			return (
				<Tooltip title={issue || undefined}>
					<Flex className={issue ? 'opacity-40' : undefined}>
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
				</Tooltip>
			);
		},
	},
];

export { warehouseColumns, expandedColumns };
