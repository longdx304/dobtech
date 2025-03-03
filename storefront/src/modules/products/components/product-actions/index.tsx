'use client';
import { Divider, message } from 'antd';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { Button } from '@/components/Button';
import InputNumber from '@/components/Input/InputNumber';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useProduct } from '@/lib/providers/product/product-provider';
import { addToCart } from '@/modules/cart/action';
import ProductInfo from '@/modules/products/components/product-info';
import useActionProduct from '@/modules/products/hook/useActionProduct';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { isEmpty } from 'lodash-es';
import { Minus, Plus } from 'lucide-react';
import OptionSelect from '../option-select';

type ProductActionsProps = {
	handleCancel?: () => void;
	disabled?: boolean;
};

export type PriceType = {
	calculated_price: string;
	original_price?: string;
	price_type?: 'sale' | 'default' | 'override';
	percentage_diff?: string;
	original_price_incl_tax?: string;
	calculated_price_incl_tax?: string;
};

export default function ProductActions({
	handleCancel = () => {},
	disabled,
}: ProductActionsProps) {
	const { region, product } = useProduct();
	const {
		options,
		updateOptions,
		variant,
		price,
		inStock,
		inventoryQuantity,
		allowedQuantities,
		quantity,
		handleAddNumber,
		handleSubtractNumber,
		handleInputChange,
	} = useActionProduct({
		product: product as PricedProduct,
	});
	const { refreshCart } = useCart();

	const [isAdding, setIsAdding] = useState(false);

	const countryCode = (useParams().countryCode as string) ?? 'vn';

	const actionsRef = useRef<HTMLDivElement>(null);

	// add the selected variant to the cart
	const handleAddToCart = async () => {
		if (isEmpty(variant) && !variant) return null;
		setIsAdding(true);

		if (quantity > 0) {
			await addToCart({
				variantId: variant.id ?? '',
				quantity: quantity,
				countryCode,
			});
			refreshCart();
			message.success('Sản phẩm được thêm vào giỏ hàng');
		}
		setIsAdding(false);
		handleCancel();
	};

	// the condition for adding quantity to cart
	const isAllowedQuantity = quantity % allowedQuantities === 0 && quantity > 0;

	return (
		<>
			<ProductInfo
				product={product!}
				region={region!}
				variant={variant}
				options={options}
			/>
			<div className="hidden lg:flex flex-col gap-y-2 mt-1" ref={actionsRef}>
				<div>
					{product?.variants?.length && (
						<div className="flex flex-col gap-y-4">
							{(product?.options || []).map((option) => {
								return (
									<div key={option.id}>
										<OptionSelect
											option={option}
											current={options[option.id]}
											updateOption={updateOptions}
											title={option.title}
											data-testid="product-options"
											disabled={!!disabled || isAdding}
										/>
									</div>
								);
							})}
							{/* quantity */}
							<div className="flex flex-col gap-y-3 mt-4">
								<span className="text-sm">Số lượng:</span>

								<InputNumber
									addonBefore={
										<Button
											onClick={handleSubtractNumber}
											icon={<Minus />}
											type="text"
											className="hover:bg-transparent w-[24px]"
										/>
									}
									addonAfter={
										<Button
											onClick={handleAddNumber}
											icon={<Plus />}
											type="text"
											className="hover:bg-transparent w-[24px]"
										/>
									}
									controls={false}
									value={quantity}
									className="max-w-[160px] [&_input]:text-center"
									onChange={handleInputChange as any}
								/>

								{/* <span>{`${inventoryQuantity ?? 0} sản phẩm có sẵn`}</span> */}
							</div>
							<Divider />
						</div>
					)}
				</div>

				<Button
					onClick={handleAddToCart}
					disabled={
						!inStock ||
						!variant ||
						!!disabled ||
						isAdding ||
						!options ||
						!price ||
						!isAllowedQuantity
					}
					className="max-w-[200px]"
					isLoading={isAdding}
					data-testid="add-product-button"
				>
					{!variant
						? 'Thêm vào giỏ hàng'
						: !inStock
						? 'Hàng đã hết'
						: 'Thêm vào giỏ hàng'}
				</Button>
			</div>
		</>
	);
}
