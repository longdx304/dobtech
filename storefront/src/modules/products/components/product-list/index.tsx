"use client";
import { Empty, Spin } from "antd";
import { useProducts } from "medusa-react";
import { FC, useEffect, useRef, useState } from "react";
import _ from 'lodash';

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

const PAGE_SIZE = 10;
const ProductList: FC<ProductListProps> = ({ data, searchValue = null }) => {
	const observerTarget = useRef(null);
	const [productData, setProductData] = useState<ProductPreviewType[]>(
		data?.products || []
	);
	const [pageNum, setPageNum] = useState(1);
	const { products, isLoading, refetch, isRefetching, count } = useProducts({
		q: searchValue || undefined,
		limit: PAGE_SIZE,
		offset: (pageNum - 1) * PAGE_SIZE,
	});

	const [pagingEnd, setPagingEnd] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !pagingEnd) {
					setPageNum((prev) => prev + 1);
				}
			},
			{ threshold: 1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(observerTarget?.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observerTarget, pagingEnd]);

	useEffect(() => {
		if (pageNum > 1 && products?.length) {
			setProductData(
				(prev) => [...prev, ...products] as ProductPreviewType[]
			);
		}
		if (count === productData?.length) {
			setPagingEnd(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products, count]);

	useEffect(() => {
		setProductData(data?.products || []);
	}, [data]);
	return (
		<div className="flex flex-col items-center gap-4">
			{productData?.length > 0 && (
				<div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4">
					{productData?.map((product, index) => (
						<ProductPreview key={index} data={product} />
					))}
				</div>
			)}
			{pagingEnd && (
				<Flex justify="center" align="center">
					<Text>Không còn sản phẩm</Text>
				</Flex>
			)}
			{(isLoading || isRefetching) && (
				<Flex justify="center" align="center">
					<Spin size="large" />
				</Flex>
			)}
			{count === 0 && (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description="Không có sản phẩm"
				/>
			)}
			<div ref={observerTarget} />
		</div>
	);
};

export default ProductList;
