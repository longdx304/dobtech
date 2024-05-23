import { listCategories } from "@/actions/productCategory";
import { MedusaProvider } from "@/lib/providers/medusa-provider";
import Header from "@/modules/common/components/header";
import Menu from "@/modules/common/components/menu";
import { TTreeCategories } from "@/types/productCategory";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import type { Metadata } from "next";
import { cache } from "react";
import "../../app/globals.css";
import theme from "../../theme";
import { RegionProvider } from "@/lib/providers/region-provider";
import { getRegion } from "@/actions/region";

export const metadata: Metadata = {
	title: "CHAMDEP VN | Giày dép nam nữ trẻ em",
	description: "Giày dép nam nữ trẻ em",
	manifest: "/manifest.json",
};

const fetchCategories = cache(async () => await listCategories());

export default async function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const region = await getRegion("vn");
	const categories = await fetchCategories();

	const getAncestors = (category: any) => {
		const convertedCategory: {
			id: string;
			label: string;
			key: string;
			children?: any[];
		} = {
			id: category.id,
			label: category.name,
			key: category.handle,
		};

		if (
			category.category_children &&
			category.category_children.length > 0
		) {
			convertedCategory.children = category.category_children.map(
				(child: any) => getAncestors(child)
			);
		}

		return convertedCategory;
	};
	const formatCategories: TTreeCategories[] | null =
		categories?.map((category) => getAncestors(category)) || null;

	return (
		<AntdRegistry>
			<ConfigProvider theme={theme}>
				<App>
					<MedusaProvider>
						<RegionProvider regionData={region}>
							<Header categories={formatCategories} />
							<Menu categories={formatCategories} />
							<div className="pb-20">{children}</div>
						</RegionProvider>
					</MedusaProvider>
				</App>
			</ConfigProvider>
		</AntdRegistry>
	);
}
