import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { ProductVariant } from '@/types/products';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import { History, Minus, Pen, Plus } from 'lucide-react';
import {
	formatInventoryQuantity,
	getInventoryUnitIssue,
} from '../../utils/inventory-display';

export interface WarehouseDataType {}

const toDisplayText = (value: unknown, fallback: string): string => {
	if (typeof value === 'string' && value.trim()) return value;
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return fallback;
};

const toImageSource = (value: unknown): string =>
	typeof value === 'string' && value.trim()
		? value
		: '/images/product-img.png';

interface Props {
	handleEditWarehouse: (item: ProductVariant) => void;
	handleOpenTransactionHistory: (id: string) => void;
}

const productColumns = ({
	handleEditWarehouse,
	handleOpenTransactionHistory,
}: Props) => [
	{
		title: 'Sản phẩm',
		key: 'title',
		className: 'text-xs',
		fixed: 'left',
		render: (_: ProductVariant | null) => {
			const productName = toDisplayText(
				_?.product?.title,
				'Sản phẩm không xác định'
			);
			const variantName = toDisplayText(_?.title, 'Biến thể không xác định');
			return (
				<Flex className="flex items-center gap-3">
					<Image
						src={toImageSource(_?.product?.thumbnail)}
						fallback="/images/product-img.png"
						preview={false}
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
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: ProductVariant) => {
			const actions = [
				{
					label: 'Thêm vị trí vào',
					icon: <Pen size={20} />,
					onClick: () => {
						handleEditWarehouse(record);
					},
				},
				{
					label: 'Lịch sử kho',
					icon: <History size={20} />,
					onClick: () => {
						handleOpenTransactionHistory(record.id);
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
		title: 'Vị trí',
		key: 'title',
		dataIndex: 'warehouse',
		className: 'text-xs',
		fixed: 'left',
		render: (_: Warehouse | null) => {
			return _?.location || 'Vị trí không còn tồn tại';
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

export { productColumns, expandedColumns };
