import { Suspense } from 'react';
import HomepageSkeleton from './skeleton';
import ProductList from '@/modules/products/components/product-list';

interface Props {
	searchParams: {
		page?: string;
	};
}

export default async function Home({ searchParams }: Props) {
	const page = searchParams.page ? parseInt(searchParams.page) : 1;

	return (
		<main className="w-full container box-border pt-[6rem] lg:pt-[8rem]">
			<Suspense key={page} fallback={<HomepageSkeleton />}>
				{/* <ProductBanner /> */}
				<ProductList page={page} />
			</Suspense>
		</main>
	);
}
