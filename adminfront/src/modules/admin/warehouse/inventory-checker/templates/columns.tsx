import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { RefreshCw } from 'lucide-react';

export interface WarehouseDataType {}

interface Props {
	isAdmin?: boolean;
	onSyncVariant?: (record: any) => void;
	syncingVariantId?: string | null;
	disabled?: boolean;
}

const inventoryColumns = ({
	isAdmin = false,
	onSyncVariant,
	syncingVariantId,
	disabled = false,
}: Props) => [
	{
		title: 'Sản phẩm',
		key: 'product',
		className: 'text-xs',
		fixed: 'left',
		render: (_: any, record: any) => {
			return (
				<Flex className="flex items-center gap-3">
					<Image
						src={record?.thumbnail ?? '/images/product-img.png'}
						alt="Product variant Thumbnail"
						width={30}
						height={40}
						className="rounded-md cursor-pointer"
					/>
					<Flex vertical className="">
						<Tooltip
							title={`${record.product_title} - ${record.variant_title}`}
						>
							<Text className="text-xs line-clamp-2">{`${record.product_title} - ${record.variant_title}`}</Text>
						</Tooltip>
						{/* <span className="text-gray-500">{_.title}</span> */}
					</Flex>
				</Flex>
			);
		},
	},
	{
		title: 'Sổ sản phẩm',
		key: 'inventory_quantity',
		dataIndex: 'inventory_quantity',
		className: 'text-xs',
		render: (_: number) => {
			return _ ?? 0;
		},
	},
	{
		title: 'Sổ kho',
		key: 'total_quantity',
		dataIndex: 'total_quantity',
		className: 'text-xs',
		render: (_: number) => {
			return _ ?? 0;
		},
	},
	{
		title: 'Đơn chờ xuất',
		key: 'committed_quantity',
		dataIndex: 'committed_quantity',
		className: 'text-xs',
		render: (_: number) => {
			return _ ?? 0;
		},
	},
	{
		title: 'Lệch',
		key: 'difference_quantity',
		dataIndex: 'difference_quantity',
		className: 'text-xs',
		render: (_: number | string) => {
			const value = Number(_ ?? 0);
			return (
				<Text className={value === 0 ? 'text-gray-700' : 'text-red-600'}>
					{value > 0 ? `+${value}` : value}
				</Text>
			);
		},
	},
	...(isAdmin
		? [
				{
					title: 'Thao tác',
					key: 'actions',
					className: 'text-xs',
					render: (_: any, record: any) => {
						const isSyncing = syncingVariantId === record.variant_id;
						const hasExpectedQuantity =
							record.expected_inventory_quantity !== undefined &&
							record.expected_inventory_quantity !== null;
						const inventoryQuantity = Number(record.inventory_quantity ?? 0);
						const expectedQuantity = Number(
							record.expected_inventory_quantity ?? inventoryQuantity
						);
						const committedQuantity = Number(record.committed_quantity ?? 0);
						const canSync = hasExpectedQuantity
							? expectedQuantity !== inventoryQuantity
							: true;
						const tooltipTitle = isSyncing
							? 'Đang đồng bộ sản phẩm này'
							: disabled
							? 'Đang đồng bộ sản phẩm khác'
							: canSync
							? 'Đồng bộ sản phẩm này'
							: committedQuantity > 0
							? 'Lệch này do đơn bán đang chờ xuất kho; hoàn tất xuất kho thì hết lệch'
							: 'Sổ sản phẩm đã đúng, không cần đồng bộ';

						return (
							<Tooltip title={tooltipTitle}>
								<span>
									<Button
										type="default"
										icon={<RefreshCw size={16} />}
										onClick={() => onSyncVariant?.(record)}
										loading={isSyncing}
										disabled={disabled || isSyncing || !canSync}
									/>
								</span>
							</Tooltip>
						);
					},
				},
		  ]
		: []),
];

export { inventoryColumns };
