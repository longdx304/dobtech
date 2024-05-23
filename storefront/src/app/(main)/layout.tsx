import { listCategories } from "@/actions/productCategory";
import Header from "@/modules/common/components/header";
import { TTreeCategories } from "@/types/productCategory";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import type { Metadata } from "next";
import { cache } from "react";
import "../../app/globals.css";
import theme from "../../theme";
import { MedusaProvider } from "@/lib/providers/medusa-provider";
import Menu from "@/modules/common/components/menu";
import { headers } from "next/headers";

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
	const heads = headers();
	const pathname = heads.get("x-pathname");

	const hiddenHeader = ["/search"];
	const hiddenMenu = ["/search"];

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
						{!hiddenHeader.includes(pathname) && (
							<Header categories={formatCategories} />
						)}
						{!hiddenMenu.includes(pathname) && (
							<Menu categories={formatCategories} />
						)}
						<div className="pb-20">
							{children}
						</div>
					</MedusaProvider>
				</App>
			</ConfigProvider>
		</AntdRegistry>
	);
}
