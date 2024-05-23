import { Metadata } from "next";
import SearchModal from "@/modules/search/templates/SearchModal";

export const metadata: Metadata = {
	title: "CHAMDEP VN | Tìm kiếm",
	description: "Tìm kiếm sản phẩm",
};

export default async function SearchPage({}) {
	return (
		<div className="w-full box-border">
			<SearchModal />
		</div>
	);
}
