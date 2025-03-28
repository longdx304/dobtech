'use client';

import { useCart } from '@/lib/providers/cart/cart-provider';
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
	type?: 'full' | 'preview';
	cartId?: string;
};

const Item = ({ item, region, type = 'full', cartId }: ItemProps) => {
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { updateCartItem } = useCart();
	const allowed_quantities = (item?.variant as any)?.allowed_quantities || 6;

	const changeQuantity = async (quantity: number) => {
		setError(null);
		setUpdating(true);

		if (type === 'preview') {
			const message = await updateCartItem(item.id, quantity, cartId)
				.catch((err: any) => {
					return err.message;
				})
				.finally(() => {
					setUpdating(false);
				});

			message && setError(message);
		} else {
			const message = await updateCartItem(item.id, quantity)
				.catch((err: any) => {
					return err.message;
				})
				.finally(() => {
					setUpdating(false);
				});

			message && setError(message);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			{type === 'full' && (
				<>
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
					<div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-end ">
						<div className="flex items-center">
							<LineItemUnitPrice item={item} region={region} />
						</div>

						<div className="flex justify-between items-center text-xs gap-2 h-fit">
							<CartItemSelect
								quantity={item.quantity}
								onChange={changeQuantity}
								allowed_quantities={allowed_quantities}
							/>

							<DeleteButton
								id={item.id}
								className="bg-transparent"
								data-testid="cart-item-remove-button"
							/>
						</div>
					</div>
				</>
			)}

			{type === 'preview' && (
				<>
					<div className="flex flex-col pt-2">
						<div className="flex items-center">
							<LineItemUnitPrice item={item} region={region} type="preview" />
						</div>

						<div className="flex justify-center items-center text-xs gap-2 h-fit">
							<CartItemSelect
								quantity={item.quantity}
								onChange={changeQuantity}
								allowed_quantities={allowed_quantities}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Item;
