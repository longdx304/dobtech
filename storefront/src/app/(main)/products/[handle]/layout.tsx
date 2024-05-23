import { notFound } from "next/navigation";

import MenuProductDetail from "@/modules/products/templates/menu-product-detail";
import { cn } from "@/lib/utils";
import {
	getProductByHandle,
	retrievePricedProductById,
} from "@/actions/products";
import { ProductProvider } from "@/lib/providers/product/product-provider";
import { getRegion } from '@/actions/region';
import { Region } from '@medusajs/medusa';

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

type Props = {
	children: React.ReactNode;
	params: { handle: string };
};

export default async function ProductDetailLayout(props: Props) {
	const { params } = props;
	const region = await getRegion("vn");

	if (!region) {
		return notFound();
	}

	const pricedProduct = await getPricedProductByHandle(
		params?.handle ?? "",
		region
	);

	if (!pricedProduct) {
		return notFound();
	}

	return (
		<div className={cn("w-full box-border")}>
			<ProductProvider productData={pricedProduct!}>
				<MenuProductDetail />
				{props.children}
			</ProductProvider>
		</div>
	);
}
