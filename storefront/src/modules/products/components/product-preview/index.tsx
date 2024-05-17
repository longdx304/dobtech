"use client";
import { FC } from "react";

import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import Thumbnail from "@/modules/products/components/thumbnail";
import { cn } from "@/lib/utils";
import PreviewPrice from "./price";
import { ProductPreviewType } from "@/types/product";

interface Props {
	data: ProductPreviewType;
}

const ProductPreview: FC<Props> = ({ data }) => {
	return (
		<LocalizedClientLink
			href={`products/${data.handle}`}
			className={cn(
				"shadow group rounded hover:shadow-lg hover:-translate-y-1.5 transition-all"
			)}
		>
			<Flex vertical>
				<Thumbnail thumbnail={data?.thumbnail} />
				<Flex vertical className="p-2 w-full box-border">
					<Text className="leading-5 text-[0.875rem] line-clamp-2 w-full">
						{data?.title}
					</Text>
					<PreviewPrice price={data.price} />
				</Flex>
			</Flex>
		</LocalizedClientLink>
	);
};

export default ProductPreview;
