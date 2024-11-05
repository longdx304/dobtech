// @ts-nocheck
import { ProductVariant } from '@medusajs/medusa';
import Image from 'next/image';
import React from 'react';

import { Flex } from '@/components/Flex';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { formatAmountWithSymbol } from '@/utils/prices';

interface Props {
	variantInventoryCell: (record: ProductVariant) => React.ReactNode;
	currencyCode: string;
}
const productsColumns = ({ variantInventoryCell, currencyCode }: Props) => [
	{
		title: 'Tên sản phẩm',
		key: 'product',
		dataIndex: 'product',
		// width: 150,
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
		title: 'Còn hàng',
		key: 'inventory_quantity',
		dataIndex: 'inventory_quantity',
		className: 'text-xs',
		render: (_: ProductVariant['ProductVariant'], record: ProductVariant) => {
			// const _render = variantInventoryCell(record);
			return _;
		},
	},
	{
		title: 'Giá tiền',
		key: 'original_price_incl_tax',
		dataIndex: 'original_price_incl_tax',
		className: 'text-xs',
		width: 250,
		render: (
			_: ProductVariant['original_price_incl_tax'],
			record: ProductVariant
		) => {
			// const _render = variantInventoryCell(record);
			if (!_) {
				return '-';
			}

			const showOriginal = _ !== 'default';
			return (
				<div className="flex items-center justify-start gap-2">
					<div className="flex flex-col items-end">
						{showOriginal && (
							<span className="text-gray-400 line-through">
								{formatAmountWithSymbol({
									amount: _,
									currency: currencyCode,
								})}
							</span>
						)}
						<span>
							{formatAmountWithSymbol({
								amount: record.calculated_price_incl_tax,
								currency: currencyCode,
							})}
						</span>
					</div>
					<span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
				</div>
			);
		},
	},
];

export default productsColumns;
