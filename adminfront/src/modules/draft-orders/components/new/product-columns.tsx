import { Flex } from '@/components/Flex';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { formatAmountWithSymbol } from '@/utils/prices';
import { ProductVariant } from '@medusajs/medusa';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { InputNumber } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { VariantPrice } from './items';

const extractPrice = (variant: ProductVariant) => {
	// Get the default price (first price in the prices array)
	const defaultPrice = variant.prices?.[0];

	if (defaultPrice) {
		return {
			formatted: formatAmountWithSymbol({
				currency: defaultPrice.currency_code,
				amount: defaultPrice.amount,
			}),
			amount: defaultPrice.amount,
			currency_code: defaultPrice.currency_code,
		};
	}

	return {
		formatted: '0',
		amount: 0,
		currency_code: 'vnd',
	};
};

interface Props {
	currency: string | undefined;
	handleQuantityChange: (value: number, variantId: string) => void;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
	getQuantity: (variantId: string) => number;
	getVariantPrice: (variantId: string) => VariantPrice;
	isVariantSelected: (variantId: string) => boolean;
}

type SelectProduct = Omit<
	ProductVariant & { quantity: number },
	'beforeInsert'
>;

const EditablePrice = ({
	record,
	handlePriceChange,
	getVariantPrice,
	currency,
	isVariantSelected,
}: {
	record: ProductVariant;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
	getVariantPrice: (variantId: string) => VariantPrice;
	currency: string | undefined;
	isVariantSelected: (variantId: string) => boolean;
}) => {
	const [isEditing, setIsEditing] = useState(false);

	const variantPrice = getVariantPrice(record.id);
	const isSelected = isVariantSelected(record.id);

	const handleStartEdit = () => {
		if (isSelected) {
			setIsEditing(true);
		}
	};

	if (isEditing && isSelected) {
		return (
			<InputNumber
				autoFocus
				defaultValue={variantPrice.unit_price}
				onBlur={() => setIsEditing(false)}
				onPressEnter={() => setIsEditing(false)}
				onChange={(value) => {
					if (value !== null) {
						handlePriceChange(record.id, value, variantPrice.currency_code);
					}
				}}
				className="w-32"
				formatter={(value) =>
					formatAmountWithSymbol({
						currency: variantPrice.currency_code,
						amount: value || 0,
					})
				}
				parser={(value) => {
					const parsed = value?.replace(/[^\d]/g, '');
					return parsed ? Number(parsed) : 0;
				}}
			/>
		);
	}

	return (
		<Text
			className={`text-right text-gray-500 ${
				isSelected ? 'cursor-pointer' : ''
			}`}
			onClick={handleStartEdit}
		>
			{formatAmountWithSymbol({
				currency: variantPrice.currency_code,
				amount: variantPrice.unit_price,
			})}
		</Text>
	);
};

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
			defaultValue={quantity || 1}
			onBlur={() => setIsEditing(false)}
			onPressEnter={() => setIsEditing(false)}
			onChange={(value) => {
				if (value !== null) {
					handleQuantityChange(value, record?.id as string);
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

const productsColumns = ({
	currency,
	handlePriceChange,
	handleQuantityChange,
	getQuantity,
	getVariantPrice,
	isVariantSelected,
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
			key: 'prices',
			dataIndex: 'prices',
			className: 'text-xs',
			// width: 250,
			render: (_: ProductVariant['prices'], record: ProductVariant) => {
				return (
					<EditablePrice
						record={record}
						getVariantPrice={getVariantPrice}
						handlePriceChange={handlePriceChange}
						currency={currency}
						isVariantSelected={isVariantSelected}
					/>
				);
			},
		},
		{
			title: 'Còn hàng',
			key: 'inventory_quantity',
			dataIndex: 'inventory_quantity',
			className: 'text-xs',
			// width: 100,
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
