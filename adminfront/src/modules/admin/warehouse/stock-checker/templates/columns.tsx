import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Text } from '@/components/Typography';
import { LineItem } from '@/types/lineItem';
import { FulfillmentItem } from '@medusajs/medusa';
import { getLineItemVariantImage } from '../../utils/variant-image';

type Props = {};

const fulfillmentColumns = [
	{
		title: '',
		key: 'image',
		dataIndex: 'image',
		width: 80,
		className: 'w-fit text-xs',
		fixed: 'left',
		render: (_: any, record: LineItem) => (
			<Image
				src={getLineItemVariantImage(record)}
				fallback="/images/product-img.png"
				alt={`Hình biến thể ${record.description || record.title}`}
				width={64}
				height={64}
				className="rounded-md object-cover hover:scale-105 transition-transform duration-300 ease-in-out cursor-zoom-in"
			/>
		),
	},
	{
		title: '',
		key: '',
		dataIndex: 'item',
		// width: 150,
		className: 'text-xs',
		render: (_: any, record: LineItem) => (
			<Flex vertical className="flex items-start justify-start gap-0">
				<Text className="text-xs line-clamp-2" strong tooltip>
					{`${record.title} - ${record.description}`}
				</Text>
				{record.variant?.sku && (
					<Text className="text-[12px] text-gray-500">
						{record.variant.sku}
					</Text>
				)}
				<Text className="line-clamp-2 text-[12px] text-gray-500">
					{`Xuất kho / Số lượng đơn`}
				</Text>
				<Text className="line-clamp-2 text-[12px]">
					{`${record.warehouse_quantity} / ${record.quantity}`}
				</Text>
			</Flex>
		),
	},
];

export default fulfillmentColumns;
