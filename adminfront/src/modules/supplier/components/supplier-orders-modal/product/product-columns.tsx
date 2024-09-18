import { ProductVariant } from '@medusajs/medusa';
import Image from 'next/image';

import { Flex } from '@/components/Flex';
import { InputNumber } from '@/components/Input';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { ItemPrice, ItemQuantity } from '../index';

interface Props {
	itemQuantities: ItemQuantity[];
	handleToAddQuantity: (value: number, variantId: string) => void;
	itemPrices: ItemPrice[];
	handlePriceChange: (value: number, variantId: string) => void;
}
const productColumns = ({
	itemQuantities,
	handleToAddQuantity,
	itemPrices,
	handlePriceChange,
}: Props) => [
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
						<Tooltip title={_.title}>
							<Text className="text-xs line-clamp-2">{_.title}</Text>
						</Tooltip>
						<span className="text-gray-500">{record.title}</span>
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
		editable: true,
		render: (_: number, record: any) => {
			const itemQuantity = itemQuantities.find(
				(item) => item.variantId === record.id
			);
			const quantity = itemQuantity ? itemQuantity.quantity : 0;
			return (
				<div className="text-gray-500 flex w-full justify-start text-right">
					<span
						onClick={() => handleToAddQuantity(-1, record.id)}
						className="hover:bg-gray-200 mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md"
					>
						<Minus size={16} strokeWidth={2} />
					</span>
					<span>{quantity || 0}</span>
					<span
						onClick={() => handleToAddQuantity(1, record.id)}
						className={clsx(
							'hover:bg-gray-200 ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md'
						)}
					>
						<Plus size={16} />
					</span>
				</div>
			);
		},
	},
	{
		title: 'Giá tiền',
		key: 'price_from_supplier',
		dataIndex: 'price_from_supplier',
		className: 'text-xs',
		width: 250,
		render: (_: any, record: any) => {
			const itemPrice = itemPrices.find((item) => item.variantId === record.id);
			const price = itemPrice ? itemPrice.unit_price : record.supplier_price;

			return (
				<div className="flex items-center justify-start gap-2">
					<InputNumber
						className="w-full"
						value={price}
						min={0}
						formatter={(value) =>
							`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}
						parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
						onChange={(value) => handlePriceChange(value as number, record.id)}
					/>
				</div>
			);
		},
	},
];

export default productColumns;
