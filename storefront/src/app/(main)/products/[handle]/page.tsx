import { getCategoriesList } from "@/actions/productCategory";
import { getProductByHandle } from "@/actions/products";
import ProductTemplate from "@/modules/products/templates";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
	params: { handle: string | null };
};

export async function generateStaticParams() {
	const staticParams = await getCategoriesList().then((responses) =>
		responses.product_categories.map((category) => ({
			handle: encodeURIComponent(category.handle),
		}))
	);

	return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { handle } = params;

	const { product } = await getProductByHandle(decodeURIComponent(handle) ?? "").then(
		(product) => product
	);

	if (!product) {
		notFound();
	}

	return {
		title: `${product.title} | CHAMDEP VN`,
		description: `${product.title}`,
		openGraph: {
			title: `${product.title} | CHAMDEP VN`,
			description: `${product.title}`,
			images: product.thumbnail ? [product.thumbnail] : [],
		},
	};
}

export default async function ProductPage({ params }: Props) {
	return (
		<div className="w-full box-border container pt-[4rem] lg:pt-[8rem]">
			<ProductTemplate
				countryCode={"vn"}
				handle={decodeURIComponent(params.handle)!}
			/>
		</div>
	);
}
