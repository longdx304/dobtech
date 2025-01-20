import { Flex } from '@/components/Flex';
import { InputNumber } from '@/components/Input';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { formatAmountWithSymbol } from '@/utils/prices';
import { ProductVariant } from '@medusajs/medusa';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
	currency: string | undefined;
	getQuantity: (variantId: string) => number;
	handleQuantityChange: (value: number, variantId: string) => void;
	getPrice: (variantId: string) => number;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
}

type SelectProduct = Omit<
	ProductVariant & { quantity?: number; unit_price?: number },
	'beforeInsert'
>;

const EditableQuantity = ({
	quantity,
	record,
	handleQuantityChange,
}: {
	quantity: number;
	record: SelectProduct;
	handleQuantityChange: (value: number, variantId: string) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);

	return isEditing ? (
		<InputNumber
			autoFocus
			min={1}
			max={record.inventory_quantity || 1}
			defaultValue={quantity || 1}
			onBlur={() => setIsEditing(false)}
			onPressEnter={() => setIsEditing(false)}
			onChange={(value) => {
				if (value !== null) {
					const finalValue = Math.min(+value, record.inventory_quantity || 1);
					handleQuantityChange(finalValue, record?.id as string);
				}
			}}
			className="w-20"
		/>
	) : (
		<Text
			className="text-right text-gray-500 cursor-pointer"
			onClick={() => setIsEditing(true)}
		>
			{quantity || 1}
		</Text>
	);
};
const EditablePrice = ({
	unitPrice,
	record,
	handlePriceChange,
	currency,
}: {
	currency: string | undefined;
	unitPrice: number;
	record: SelectProduct;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);

	return isEditing ? (
		<InputNumber
			autoFocus
			min={1}
			defaultValue={unitPrice || 1}
			onBlur={() => setIsEditing(false)}
			onPressEnter={() => setIsEditing(false)}
			onChange={(value) => {
				if (value !== null) {
					handlePriceChange(record?.id, +value, currency || 'vnd');
				}
			}}
			className="w-20"
		/>
	) : (
		<Text
			className="text-right text-gray-500 cursor-pointer"
			onClick={() => setIsEditing(true)}
		>
			{formatAmountWithSymbol({
				amount: unitPrice,
				currency: currency || 'vnd',
			})}
		</Text>
	);
};

const productsColumns = ({
	currency,
	getQuantity,
	handleQuantityChange,
	getPrice,
	handlePriceChange,
}: Props) => {
	return [
		{
			title: 'Tên sản phẩm',
			key: 'product',
			dataIndex: 'product',
			className: 'text-xs',
			fixed: 'left',
			render: (_: any, record: ProductVariant) => (
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
			),
		},
		{
			title: 'Số lượng',
			key: 'quantity',
			dataIndex: 'quantity',
			className: 'text-xs',
			width: 100,

			render: (_: any, record: SelectProduct) => {
				return (
					<EditableQuantity
						quantity={getQuantity(record?.id as string)}
						record={record}
						handleQuantityChange={handleQuantityChange}
					/>
				);
			},
		},
		{
			title: 'Giá tiền',
			key: 'unit_price',
			dataIndex: 'unit_price',
			className: 'text-xs text-center',
			render: (_: any, record: SelectProduct) => {
				return (
					<EditablePrice
						unitPrice={getPrice(record?.id as string)}
						record={record}
						handlePriceChange={handlePriceChange}
						currency={currency}
					/>
				);
			},
		},
		{
			title: 'Còn hàng',
			key: 'inventory_quantity',
			dataIndex: 'inventory_quantity',
			className: 'text-xs',
			render: (
				_: ProductVariant['inventory_quantity'],
				record: ProductVariant
			) => {
				return _;
			},
		},
	];
};

export default productsColumns;
