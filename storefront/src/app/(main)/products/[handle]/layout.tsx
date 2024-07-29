import { notFound } from "next/navigation";

import {
	getProductByHandle,
	retrievePricedProductById,
} from "@/actions/products";
import { getRegion } from "@/actions/region";
import { ProductProvider } from "@/lib/providers/product/product-provider";
import { VariantImagesProvider } from "@/lib/providers/product/variant-images-provider";
import { cn } from "@/lib/utils";
import MenuProductDetail from "@/modules/products/templates/menu-product-detail";
import { Region } from "@medusajs/medusa";

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
		decodeURIComponent(params?.handle) ?? "",
		region
	);

	if (!pricedProduct) {
		return notFound();
	}

	return (
		<div className={cn("w-full box-border")}>
			<ProductProvider productData={pricedProduct} regionData={region}>
				<VariantImagesProvider>
					<MenuProductDetail />
					{props.children}
				</VariantImagesProvider>
      </ProductProvider>
		</div>
	);
}
