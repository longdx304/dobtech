import { FC } from 'react';

import { retrievePricedProductById } from '@/actions/products';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { getProductPrice } from '@/lib/utils/get-product-price';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import Thumbnail from '@/modules/products/components/thumbnail';
import { ProductPreviewType } from '@/types/product';
import { Region } from '@medusajs/medusa';
import ProductPrice from './product-price';

interface Props {
	data: ProductPreviewType;
	region?: Region;
}

const ProductPreview: FC<Props> = async ({ data, region }) => {
	const pricedProduct = await retrievePricedProductById({
		id: data.id,
		regionId: region?.id || '',
	}).then((product) => product);

	if (!pricedProduct) {
		return null;
	}

	const { cheapestPrice, variantPrice, product } = getProductPrice({
		product: pricedProduct,
		region,
	});

	return (
		<Flex
			vertical
			className="shadow group rounded lg:hover:shadow-lg transition-all cursor-pointer"
		>
			<LocalizedClientLink href={`products/${data.handle}`}>
				<Thumbnail thumbnail={data?.thumbnail} />
			</LocalizedClientLink>
			<Flex vertical className="p-2 pb-3 w-full box-border">
				<LocalizedClientLink href={`products/${data.handle}`}>
					<Text
						className="leading-4 text-[0.875rem] line-clamp-1 w-full text-black font-normal"
						data-testid="product-title"
					>
						{data?.title}
					</Text>
				</LocalizedClientLink>
				{pricedProduct && region && (
					<ProductPrice
						product={pricedProduct}
						region={region}
						productHandle={data.handle || ''}
					/>
				)}
			</Flex>
		</Flex>
	);
};

export default ProductPreview;
