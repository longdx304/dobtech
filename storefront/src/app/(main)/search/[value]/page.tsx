import { Metadata } from "next";

import SearchModal from "@/modules/search/templates/SearchModal";
import { getProductsList } from "@/actions/products";
import ProductList from '@/modules/products/components/product-list';

export const metadata: Metadata = {
	title: "CHAMDEP VN | Tìm kiếm",
	description: "Tìm kiếm sản phẩm",
};

type Params = {
	params: { value: string };
	searchParams: Record<string, unknown>;
};

export default async function SearchPage({ params, searchParams }: any) {
	const searchValue = decodeURIComponent(params?.value || "");

	const queryParams = {
		q: searchValue,
		limit: 6,
		offset: 0,
	};
	const { response } = await getProductsList({
		pageParam: 0,
		queryParams,
	} as any);

	return (
		<div className="w-full box-border container pt-[6rem] lg:pt-[8rem]">
			<ProductList data={response} searchValue={searchValue} />
		</div>
	);
}
