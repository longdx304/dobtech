import { FC, useMemo, useState, useEffect } from "react";
import { Image } from "antd";
import _ from "lodash";

import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useVariantImages } from "@/lib/providers/product/variant-images-provider";

type Props = {
  product: PricedProduct;
};

const ImageGroup: FC<Props> = ({ product }) => {
	const { optionValue } = useVariantImages();
	const [currentImage, setCurrentImage] = useState<string>();
	const [itemsImage, setItemsImage] = useState<string[] | string>();

  const images = useMemo(() => {
    if (product?.images?.length) {
      return product.images.map((image) => image.url);
    }
    if (product?.thumbnail) {
      return product?.thumbnail;
    }
    return "";
  }, [product]);

	const variantImg = product?.metadata?.variant_images ? JSON.parse(
		(product?.metadata?.variant_images as string)
	) : null;

	useEffect(() => {
		if (product?.images?.length) {
      setItemsImage(product.images.map((image: any) => image.url));
			if (optionValue && variantImg) {
				const imageId = variantImg.find((item: any) => item.variant_value === optionValue)?.image_id;
				const findImage = product.images.find((img: any) => img.id === imageId);
				_.isEmpty(findImage) ? setCurrentImage(product?.images[0].url) : setCurrentImage(findImage.url);
			} else {
				setCurrentImage(product?.images[0].url)
			}
    }
    else {
      setItemsImage(product?.thumbnail as string);
    }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, optionValue])

  return (
    <div className="aspect-square">
      {typeof itemsImage === "object" && (
        <Image.PreviewGroup items={itemsImage}>
          <Image
          alt={product?.handle!}
          width={120}
          height={120}
          src={currentImage || "/images/product-img.webp"}
        />
        </Image.PreviewGroup>
      )}
      {typeof itemsImage === "string" && (
        <Image
          alt={product?.handle!}
          width={120}
          height={120}
          src={itemsImage || "/images/product-img.webp"}
        />
      )}
    </div>
  );
};

export default ImageGroup;
