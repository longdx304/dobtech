import { getCustomer } from '@/actions/customer';
import { listCategories } from '@/actions/productCategory';
import { getRegion } from '@/actions/region';
import { CartProvider } from '@/lib/providers/cart/cart-provider';
import { MedusaProvider } from '@/lib/providers/medusa-provider';
import { RegionProvider } from '@/lib/providers/region-provider';
import { CustomerProvider } from '@/lib/providers/user/user-provider';
import { TTreeCategories } from '@/types/productCategory';
import type { Metadata } from 'next';
import { cache, Suspense } from 'react';
import '../../app/globals.css';

import StyleComponentsRegistry from '@/lib/providers/antd-provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import dynamic from 'next/dynamic';
import HomepageSkeleton from './skeleton';

const Header = dynamic(() => import('@/modules/common/components/header'));
const Menu = dynamic(() => import('@/modules/common/components/menu'));

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
			metadata?: Record<string, string>;
			children?: any[];
		} = {
			id: category.id,
			label: category.name,
			key: category.handle,
			metadata: category.metadata,
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

	return (
		<AntdRegistry>
			<StyleComponentsRegistry>
				<MedusaProvider>
					<RegionProvider regionData={region!}>
						<CustomerProvider initialCustomer={customer}>
							<CartProvider>
								<Header categories={formatCategories} />
								<Menu categories={formatCategories} />
								<Suspense fallback={<HomepageSkeleton />}>
									<main>{children}</main>
								</Suspense>
							</CartProvider>
						</CustomerProvider>
					</RegionProvider>
				</MedusaProvider>
			</StyleComponentsRegistry>
		</AntdRegistry>
	);
}
