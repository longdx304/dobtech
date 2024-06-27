import {
	getProductByHandle,
	getProductsList,
	retrievePricedProductById,
} from '@/actions/products';
import { getRegion } from '@/actions/region';
import { Region, StoreGetProductsParams } from '@medusajs/medusa';
import ProductList from '../product-list';

type RelatedProductsProps = {
	countryCode: string;
	handle: string;
};

const getPricedProductByHandle = async (handle: string, region: Region) => {
	const { product } = await getProductByHandle(handle).then(
		(product) => product
	);

	if (!product || !product.id) {
		return null;
	}

	const pricedProduct = await retrievePricedProductById({
		id: product.id,
		regionId: region.id,
	});

	return pricedProduct;
};

export default async function RelatedProducts({
	// product,
	countryCode,
	handle,
}: RelatedProductsProps) {
	const region = await getRegion(countryCode);

	if (!region) {
		return null;
	}

	const pricedProduct = await getPricedProductByHandle(
		handle,
		region as Region
	);

	const product = await retrievePricedProductById({
		id: pricedProduct?.id as string,
		regionId: region?.id as string,
	});

	if (!product) {
		return null;
	}
	// edit this function to define your related products logic
	const setQueryParams = (): StoreGetProductsParams => {
		const params: StoreGetProductsParams = {};

		if (region?.id) {
			params.region_id = region.id;
		}

		if (region?.currency_code) {
			params.currency_code = region.currency_code;
		}

		if (product.collection_id) {
			params.collection_id = [product.collection_id];
		}

		if (product.tags) {
			params.tags = product.tags.map((t: any) => t.value);
		}

		params.is_giftcard = false;

		return params;
	};

	const queryParams = setQueryParams();

	const productPreviews = await getProductsList({
		queryParams,
		countryCode,
	}).then(({ response }) =>
		response.products.filter(
			(productPreview) => productPreview.id !== product.id
		)
	);

	if (!productPreviews.length) {
		return null;
	}

	const response = {
		products: productPreviews,
		count: productPreviews.length,
	};

	return (
		<div className="product-page-constraint">
			<div className="flex flex-col items-center text-center mb-16">
				<span className="font-bold text-xl mr-4">Khách Hàng Cũng Được Xem</span>
			</div>

			<ProductList />
		</div>
	);
}
