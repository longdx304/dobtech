"use client";
import { FC, useState, useEffect, useRef } from "react";
import { Empty, Spin } from "antd";
import { useProducts } from "medusa-react";

import { Flex } from "@/components/Flex";
import ProductPreview from "@/modules/products/components/product-preview";
import { ProductPreviewType } from "@/types/product";
import { Text } from "@/components/Typography";

interface ProductListProps {
	data: {
		products: ProductPreviewType[];
		count: number;
	};
	searchValue?: string | null;
}

const PAGE_SIZE = 6;
const ProductList: FC<ProductListProps> = ({ data, searchValue = null }) => {
	const ref = useRef(null);
	const [productData, setProductData] = useState<ProductPreviewType[]>(
		data?.product || []
	);
	const [pageNum, setPageNum] = useState(1);
	const { products, isLoading, refetch, isRefetching, count } = useProducts({
		q: searchValue,
		limit: PAGE_SIZE,
		offset: (pageNum - 1) * PAGE_SIZE,
	});

	const [pagingEnd, setPagingEnd] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrolledTo = window.scrollY + window.innerHeight;
			const isReachBottom = document.body.scrollHeight === scrolledTo;
			if (isReachBottom && productData?.length < count) {
				setPageNum((prev) => prev + 1);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [productData, count]);

	useEffect(() => {
		if (pageNum > 1 && products?.length) {
			setProductData((prev) => [...prev, ...products]);
		}
	}, [products]);

	useEffect(() => {
		setProductData(data?.products || []);
	}, [data]);
	return (
		<div className="flex flex-col items-center gap-4">
			{productData?.length > 0 && (
				<div
					className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 w-full gap-x-6 gap-y-6"
					ref={ref}
				>
					{productData?.map((product) => (
						<ProductPreview
							key={product.id}
							data={product}
							searchValue={searchValue}
						/>
					))}
				</div>
			)}
			{(isLoading || isRefetching) && (
				<Flex justify="center" items="center">
					<Spin size="large" />
				</Flex>
			)}
			{count === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
		</div>
	);
};

export default ProductList;
