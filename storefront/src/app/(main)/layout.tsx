import { getCustomer } from '@/actions/customer';
import { listCategories } from '@/actions/productCategory';
import { getRegion } from '@/actions/region';
import { CartProvider } from '@/lib/providers/cart/cart-provider';
import { MedusaProvider } from '@/lib/providers/medusa-provider';
import { RegionProvider } from '@/lib/providers/region-provider';
import { CustomerProvider } from '@/lib/providers/user/user-provider';
import { retrieveCart } from '@/modules/cart/action';
import Header from '@/modules/common/components/header';
import Menu from '@/modules/common/components/menu';
import { TTreeCategories } from '@/types/productCategory';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { cache } from 'react';
import '../../app/globals.css';
import theme from '../../theme';

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Giày dép nam nữ trẻ em',
	description: 'Giày dép nam nữ trẻ em',
	manifest: '/manifest.json',
};

const fetchCategories = cache(async () => await listCategories());

export default async function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const region = await getRegion('vn');
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

		if (category.category_children && category.category_children.length > 0) {
			convertedCategory.children = category.category_children.map(
				(child: any) => getAncestors(child)
			);
		}

		return convertedCategory;
	};
	const formatCategories: TTreeCategories[] | null =
		categories?.map((category) => getAncestors(category)) || null;

	const customer = await getCustomer();
	const cart = await retrieveCart();

	return (
		<ConfigProvider theme={theme}>
			<App>
				<MedusaProvider>
					<RegionProvider regionData={region!}>
						<CustomerProvider initialCustomer={customer}>
							<CartProvider>
								<Header categories={formatCategories} />
								<Menu categories={formatCategories} />
								<div>{children}</div>
							</CartProvider>
						</CustomerProvider>
					</RegionProvider>
				</MedusaProvider>
			</App>
		</ConfigProvider>
	);
}
