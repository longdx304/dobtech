import { Col, Divider, message, Row } from 'antd';
import { Minus, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { InputNumber } from '@/components/Input';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { addToCart } from '@/modules/cart/action';
import OptionSelect from '@/modules/products/components/option-select';
import ProductPrice from '@/modules/products/components/product-price';
import useActionProduct from '@/modules/products/hook/useActionProduct';
import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import ImageGroup from './ImageGroup';

type Props = {
	open: boolean;
	onClose: () => void;
	product: PricedProduct;
	region: Region;
	disabled?: boolean;
};

const DrawPriceProduct: FC<Props> = ({
	open,
	onClose,
	product,
	region,
	disabled,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const countryCode = (useParams().countryCode as string) ?? 'vn';

	const {
		options,
		updateOptions,
		variant,
		inStock,
		inventoryQuantity,
		quantity,
		handleAddNumber,
		handleSubtractNumber,
		handleInputChange,
	} = useActionProduct({
		product,
	});

	const { refreshCart } = useCart();

	// add the selected variant to the cart
	const handleAddToCart = async () => {
		if (!variant?.id) return null;
		setIsAdding(true);

		await addToCart({
			variantId: variant.id,
			quantity: quantity,
			countryCode,
		});

		refreshCart();

		message.success('Sản phẩm được thêm vào giỏ hàng');
		onClose();
		setIsAdding(false);
	};

	const title = (
		<Flex justify="flex-start" gap="middle" align="flex-end">
			<ImageGroup product={product} />
			<Flex vertical align="flex-start" justify="flex-end" gap="4px">
				<ProductPrice
					className="text-[18px] font-semibold"
					product={product}
					variant={variant as any}
					region={region}
					options={options}
					isDrawer={true}
				/>
				<Text className="text-sm text-gray-400">{`Kho: ${
					inventoryQuantity ?? 0
				}`}</Text>
			</Flex>
		</Flex>
	);

	const buttonText = !inStock ? 'Hàng đã hết' : 'Thêm vào giỏ hàng';
  
	const footer = (
		<Button
			onClick={handleAddToCart}
			disabled={!inStock || !variant || !!disabled || isAdding}
			className="w-full h-10 rounded-[4px] mb-2"
			isLoading={isAdding}
			data-testid="add-product-button"
		>
			{!variant ? 'Thêm vào giỏ hàng' : buttonText}
		</Button>
	);
	return (
		<Drawer
			placement="bottom"
			onClose={onClose}
			open={open}
			className="h-auto [&_.ant-drawer-body]:p-4 [&_.ant-drawer-header-title]:flex-row-reverse [&_.ant-drawer-header-title]:items-start [&_.ant-drawer-header]:py-3 [&_.ant-drawer-header]:pl-3"
			footer={footer}
			title={title}
			height={'auto'}
		>
			<Row>
				<Col span={24}>
					{product?.variants?.length > 1 && (
						<div className="flex flex-col">
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
										<Divider className="my-3" />
									</div>
								);
							})}
							{/* quantity */}
							<Flex justify="space-between" align="center">
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
							</Flex>
						</div>
					)}
				</Col>
			</Row>
		</Drawer>
	);
};

export default DrawPriceProduct;
