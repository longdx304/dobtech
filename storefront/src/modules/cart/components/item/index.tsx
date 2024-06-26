'use client';

import { updateLineItem } from '@/modules/cart/action';
import DeleteButton from '@/modules/common/components/delete-button';
import LineItemOptions from '@/modules/common/components/line-item-options';
import LineItemUnitPrice from '@/modules/common/components/line-item-unit-price';
import { LineItem, Region } from '@medusajs/medusa';
import { Typography } from 'antd';
import { useState } from 'react';
import CartItemSelect from '../cart-item-select';

const { Text } = Typography;

type ItemProps = {
	item: Omit<LineItem, 'beforeInsert'>;
	region: Region;
};

const Item = ({ item, region }: ItemProps) => {
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { handle } = item.variant.product;

	const changeQuantity = async (quantity: number) => {
		setError(null);
		setUpdating(true);

		const message = await updateLineItem({
			lineId: item.id,
			quantity,
		})
			.catch((err: any) => {
				return err.message;
			})
			.finally(() => {
				setUpdating(false);
			});

		message && setError(message);
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex gap-[2px] text-xs flex-col">
				<Text data-testid="product-title">{item.title}</Text>
				<div className="flex items-center gap-2">
					<span>Phân loại hàng:</span>
					<span className="bg-gray-200 px-[12px] py-[2px] rounded-lg">
						<LineItemOptions
							variant={item.variant}
							data-testid="product-variant"
						/>
					</span>
				</div>
			</div>
			<div className="flex gap-4 justify-between">
				<div className="flex items-center">
					<LineItemUnitPrice item={item} region={region} />
				</div>

				<div className="flex justify-between items-center text-xs gap-4">
					<CartItemSelect quantity={item.quantity} onChange={changeQuantity} />

					<DeleteButton
						id={item.id}
						className="mt-1 bg-transparent"
						data-testid="cart-item-remove-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default Item;
