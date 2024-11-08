// @ts-nocheck
import { ProductVariant, Region } from '@medusajs/medusa';
import Image from 'next/image';

import { Flex } from '@/components/Flex';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { ItemPrice, ItemQuantity } from '../index';

interface Props {
	itemQuantities: ItemQuantity[];
	itemPrices: ItemPrice[];
	region?: Region;
}
/**
 * productTotalColumns
 * @param {{ itemQuantities: ItemQuantity[]; itemPrices: ItemPrice[] }} props
 * @returns {TableColumnsType<ProductVariant>}
 *
 * A function that returns an array of columns for a table that displays the total of each product variant.
 *
 * @example
 * const columns = productTotalColumns({ itemQuantities, itemPrices });
 * <Table columns={columns} dataSource={data} />
 */
const productTotalColumns = ({ itemQuantities, itemPrices, region }: Props) => [
	{
		title: 'Tên sản phẩm',
		key: 'product',
		dataIndex: 'product',
		className: 'text-xs',
		fixed: 'left',
		render: (_: any, record: ProductVariant) => {
			return (
				<Flex className="flex items-center gap-3">
					<Image
						src={_?.thumbnail ?? '/images/product-img.png'}
						alt="Product variant Thumbnail"
						width={30}
						height={40}
						className="rounded-md cursor-pointer"
					/>
					<Flex vertical className="">
						<Tooltip title={_?.title}>
							<Text className="text-xs line-clamp-2">{_?.title}</Text>
						</Tooltip>
						<span className="text-gray-500">{record?.title}</span>
					</Flex>
				</Flex>
			);
		},
	},
	{
		title: 'Số lượng',
		key: 'quantity',
		dataIndex: 'quantity',
		className: 'text-xs',
		render: (_: number, record: any) => {
			const itemQuantity = itemQuantities.find(
				(item) => item.variantId === record?.id
			);
			const quantity = itemQuantity ? itemQuantity?.quantity : 0;
			return <Text className="text-xs">{quantity || 0}</Text>;
		},
	},
	{
		title: 'Giá đơn hàng',
		key: 'price',
		dataIndex: 'price',
		className: 'text-xs',
		render: (_: number, record: any) => {
			const itemPrice = itemPrices?.find(
				(item) => item?.variantId === record?.id
			);
			const price = itemPrice ? itemPrice?.unit_price : 0;

			return (
				<Text className="text-xs">
					{price?.toLocaleString()}
					{region?.currency.symbol}
				</Text>
			);
		},
	},
];

export default productTotalColumns;
