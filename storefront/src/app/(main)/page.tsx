import Image from "next/image";

import ProductList from "@/modules/products/components/product-list";

export default function Home() {
	return (
		<main className="w-full container pt-[8rem]">
			<ProductList />
		</main>
	);
}
