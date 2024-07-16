import { LineItem, InventoryLevelDTO } from '@medusajs/medusa';
import { Pencil, Trash, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Flex } from '@/components/Flex';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import { formatAmountWithSymbol } from '@/utils/prices';

interface Props {
	currencyCode: string;
}
const productsColumns = ({ currencyCode }: Props) => [
	{
		title: 'Chi tiết sản phẩm',
		key: 'title',
		dataIndex: 'title',
		// width: 150,
		className: 'text-xs',
		fixed: 'left',
		render: (_: LineItem['title'], record: Omit<LineItem, "beforeInsert">) => (
			<Flex className="flex items-center gap-3">
				<Image
					src={record?.thumbnail ?? '/images/product-img.png'}
					alt="Product variant Thumbnail"
					width={30}
					height={40}
					className="rounded-md cursor-pointer"
				/>
				<Flex vertical className="">
					<Tooltip title={_}>
						<Text className="text-xs line-clamp-2">{_}</Text>
					</Tooltip>
					<span className="text-gray-500">{record.description}</span>
				</Flex>
			</Flex>
		),
	},
	{
		title: 'Số lượng',
		key: 'quantity',
		dataIndex: 'quantity',
		className: 'text-xs',
		render: (_: LineItem['quantity'], record: Omit<LineItem, "beforeInsert">) => {
			return _;
		},
	},
	{
		title: 'Số tiền hoàn trả',
		key: 'refundable',
		dataIndex: 'refundable',
		className: 'text-xs',
		render: (_: LineItem['refundable'], record: Omit<LineItem, "beforeInsert">) => {
			return (
				<div className="flex items-center">
					<span className="pr-1">
						{formatAmountWithSymbol({
							currency: currencyCode,
							amount: _ || 0,
						})}
					</span>
					<span className="text-gray-400">{currencyCode.toUpperCase()}</span>
				</div>
			);
		},
	},
];

export default productsColumns;
