"use client";
import ProductPrice from "../product-price";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { Flex, Rate } from "antd";
import { useProduct } from "@/lib/providers/product/product-provider";
import { useRegion } from "@/lib/providers/region-provider";

type ProductInfoProps = {};

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const ProductInfo = ({}: ProductInfoProps) => {
	const { product } = useProduct();
	const { region } = useRegion();
	const [options, setOptions] = useState<Record<string, string>>({});
	const [value, setValue] = useState(3);

	const variants = product?.variants;

	// initialize the option state
	useEffect(() => {
		const optionObj: Record<string, string> = {};

		for (const option of product?.options || []) {
			Object.assign(optionObj, { [option.id]: undefined });
		}

		setOptions(optionObj);
	}, [product]);

	// memoized record of the product's variants
	const variantRecord = useMemo(() => {
		const map: Record<string, Record<string, string>> = {};
		if (_.isEmpty(variants)) return {};
		for (const variant of variants) {
			if (!variant.options || !variant.id) continue;

			const temp: Record<string, string> = {};

			for (const option of variant.options) {
				temp[option.option_id] = option.value;
			}

			map[variant.id] = temp;
		}

		return map;
	}, [variants]);

	// memoized function to check if the current options are a valid variant
	const variant = useMemo(() => {
		let variantId: string | undefined = undefined;
		if (_.isEmpty(variantRecord)) return {};

		for (const key of Object.keys(variantRecord)) {
			if (_.isEqual(variantRecord[key], options)) {
				variantId = key;
			}
		}

		return variants.find((v) => v.id === variantId);
	}, [options, variantRecord, variants]);

	return (
		<div className="relative">
			<ProductPrice
				className="text-[18px] font-semibold"
				product={product}
				variant={variant}
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
