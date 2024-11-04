import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HomepageSkeleton from './skeleton';

interface Props {
	searchParams: {
		page?: string;
	};
}
const ProductList = dynamic(
	() => import('@/modules/products/components/product-list'),
	{
		loading: () => <HomepageSkeleton />,
	}
);

export default async function Home({ searchParams }: Props) {
	const page = searchParams.page ? parseInt(searchParams.page) : 1;

	return (
		<main className="w-full container box-border pt-[6rem] lg:pt-[8rem]">
			<Suspense key={page} fallback={<HomepageSkeleton />}>
				<ProductList page={page} />
			</Suspense>
		</main>
	);
}
