import { FC, useMemo } from "react";
import { Image } from "antd";

import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

type Props = {
	product: PricedProduct;
};

const ImageGroup: FC<Props> = ({ product }) => {
	const images = useMemo(() => {
		if (product?.images?.length) {
			return product.images.map((image) => image.url);
		}
		if (product?.thumbnail) {
			return product?.thumbnail;
		}
		return "";
	}, [product]);
	return (
		<div className="aspect-square">
			{typeof images === "object" && (
				<Image.PreviewGroup>
					{product?.images?.map((image, index) => (
						<Image
							key={index}
							alt={`${product?.handle}-${index}`}
							width={120}
							height={120}
							src={image.url}
						/>
					))}
				</Image.PreviewGroup>
			)}
			{typeof images === "string" && (
				<Image
					alt={product?.handle}
					width={120}
					height={120}
					src={images || "/images/product-img.png"}
				/>
			)}
		</div>
	);
};

export default ImageGroup;
