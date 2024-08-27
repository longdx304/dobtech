import { Suspense, lazy } from 'react';
import HomepageSkeleton from './skeleton';

// const ProductBanner = lazy(
// 	() => import('@/modules/products/components/product-banner')
// );
const ProductList = lazy(
	() => import('@/modules/products/components/product-list')
);

interface Props {
	searchParams: {
		page?: string;
	};
}

export default async function Home({ searchParams }: Props) {
	const page = searchParams.page ? parseInt(searchParams.page) : 1;

	return (
		<main className="w-full container box-border pt-[6rem] lg:pt-[8rem]">
			<Suspense fallback={<HomepageSkeleton />}>
				{/* <ProductBanner /> */}
				<ProductList page={page} />
			</Suspense>
		</main>
	);
}
