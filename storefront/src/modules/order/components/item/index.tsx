'use client';

import { Text } from '@/components/Typography';
import LineItemOptions from '@/modules/common/components/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item-price';
import LineItemUnitPrice from '@/modules/common/components/line-item-unit-price';
import { LineItem, Region } from '@medusajs/medusa';

type ItemProps = {
	item: Omit<LineItem, 'beforeInsert'>;
	region: Region;
};

const Item = ({ item, region }: ItemProps) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center">
				<Text data-testid="product-title">{item.title}</Text>
				<div className="flex items-center gap-1">
					<Text
						style={{ width: '-webkit-fill-available' }}
						className="text-[12px]"
					>
						{item.quantity}x
					</Text>
					<LineItemUnitPrice item={item} region={region} />
				</div>
			</div>
			<div className="flex justify-between items-center gap-10 lg:gap-0">
				<div className="flex items-center gap-2">
					<span>Phân loại hàng:</span>
					<span className="bg-gray-200 px-2 py-1 rounded-lg">
						<LineItemOptions
							variant={item.variant}
							data-testid="product-variant"
						/>
					</span>
				</div>
				<LineItemPrice item={item} region={region} style="tight" />
			</div>
		</div>
	);
};

export default Item;
