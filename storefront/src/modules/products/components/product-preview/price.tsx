'use client';
import { Region } from '@medusajs/medusa';
import { LoaderCircle } from 'lucide-react';
import { FC, MouseEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProduct } from '@/lib/providers/product/product-provider';
import DrawPriceProduct from '@/modules/products/templates/menu-product-detail/DrawPriceProduct';
import ProductTemplateModal from '@/modules/products/templates/product-template-modal';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { PriceType } from '../product-actions';
import CartIcon from './CartIcon';

interface Props {
	price: PriceType;
	productHandle?: string;
	product: PricedProduct;
	region: Region;
}

const PreviewPrice: FC<Props> = ({ price, productHandle, product, region }) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const {
		state: stateDrawer,
		onOpen: onOpenDrawer,
		onClose: onCloseDrawer,
	} = useToggleState(false);
	const { setProduct, setRegion } = useProduct();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// Format price
	const formattedPrice = (priceString: string) => {
		const price = Number(priceString.replace(/[^\d.-]/g, ''));
		const formattedPrice =
			isNaN(price) || price === 0 ? '-' : `${price.toLocaleString()}₫`;
		return formattedPrice;
	};

	const handleClickCartDesktop = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setIsLoading(true);
		if (!product || !region) {
			setIsLoading(false);
			return;
		}
		setProduct(product);
		setRegion(region);
		setIsLoading(false);
		onOpen();
		return;
	};

	const handleClickCartMobile = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setIsLoading(true);
		if (!product || !region) {
			setIsLoading(false);
			return;
		}
		setProduct(product);
		setRegion(region);
		setIsLoading(false);
		onOpenDrawer();
		return;
	};

	const handleModalClose = () => {
		onClose();
	};

	return (
		<Flex vertical>
			{/* <a onClick={handleLinkClick}> */}
			<Flex justify="space-between" align="center" className="">
				{price.price_type === 'sale' ? (
					<Flex align="center">
						<Text className="text-[16px] font-semibold text-[#FA6338]">
							{formattedPrice(price.calculated_price)}
						</Text>
						<Text className="text-[10px] font-normal border-[#FFD9CE] border-[1px] border-solid text-[#FA6338] px-[3px] py-[2px] ml-2">
							-{price.percentage_diff}%
						</Text>
					</Flex>
				) : (
					<Text className="text-[16px] font-semibold">
						{formattedPrice(price.calculated_price)}
					</Text>
				)}

				<Button
					type="default"
					shape="circle"
					onClick={handleClickCartDesktop}
					// icon={<CartIcon />}
					icon={
						isLoading ? (
							<LoaderCircle size={16} className="animate-spin" />
						) : (
							<CartIcon />
						)
					}
					className="h-[24px] w-[38px] rounded-[20px] border-black/40 hidden md:flex"
				/>
				<Button
					type="default"
					shape="circle"
					onClick={handleClickCartMobile}
					// icon={<CartIcon />}
					icon={
						isLoading ? (
							<LoaderCircle size={16} className="animate-spin" />
						) : (
							<CartIcon />
						)
					}
					className="h-[24px] w-[38px] rounded-[20px] border-black/40 flex md:hidden"
				/>
			</Flex>
			{/* </a> */}
			<ProductTemplateModal
				state={state}
				handleOk={handleModalClose}
				handleCancel={handleModalClose}
				productHandle={productHandle || ''}
			/>
			<DrawPriceProduct
				open={stateDrawer}
				onClose={onCloseDrawer}
				product={product!}
				region={region!}
			/>
		</Flex>
	);
};

export default PreviewPrice;
