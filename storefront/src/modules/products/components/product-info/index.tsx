"use client";

import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import ProductPrice from "../product-price";
import { notFound } from "next/navigation";
import {
	PricedProduct,
	PricedVariant,
} from "@medusajs/medusa/dist/types/pricing";
import { Region } from "@medusajs/medusa";

type ProductInfoProps = {
	product: PricedProduct;
	region: Region;
	variant?: PricedVariant;
};

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const ProductInfo = ({ product, region, variant }: ProductInfoProps) => {

	if (!product || !region) {
		notFound();
	}

	return (
		<div className="relative">
			<ProductPrice
				className="text-[18px] font-semibold"
				product={product}
				variant={variant as any}
				region={region}
			/>
			<h1 className="text-2xl font-semibold">{product?.title}</h1>
			{/* Feedback */}
			{/* <div className='flex items-center space-x-12 mt-4 py-2'>
        <Flex gap='middle'>
          <Rate tooltips={desc} onChange={setValue} value={value} />
          {value ? <span>{desc[value - 1]}</span> : null}
        </Flex>
      </div> */}
		</div>
	);
};

export default ProductInfo;
