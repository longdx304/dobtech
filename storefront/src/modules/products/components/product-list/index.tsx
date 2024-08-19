import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';
import { ProductProvider } from '@/lib/providers/product/product-provider';
import { VariantImagesProvider } from '@/lib/providers/product/variant-images-provider';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import Pagination from './pagination';

const ProductPreview = dynamic(
	() => import('@/modules/products/components/product-preview')
);


interface ProductListProps {
	page?: number;
}
const PAGE_SIZE = 20;

const ProductList: FC<ProductListProps> = async ({ page = 1 }) => {
	const region = await getRegion('vn');

	const { response: data } = await getProductsList({
		pageParam: page,
		queryParams: {
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE,
		},
	});

	return (
		<ProductProvider productData={undefined} regionData={undefined}>
			<VariantImagesProvider>
				<div className="flex flex-col items-center gap-4 pb-16">
					{data.products?.length > 0 && (
						<div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4">
							{data.products?.map((product, index) => (
								<ProductPreview
									key={product.id}
									data={product}
									region={region!}
								/>
							))}
						</div>
					)}
					{!!page && page > 1 && (
						<Pagination
							total={data.count}
							currentPage={page || 1}
							pageSize={PAGE_SIZE}
						/>
					)}
				</div>
			</VariantImagesProvider>
		</ProductProvider>
	);
};

export default ProductList;
