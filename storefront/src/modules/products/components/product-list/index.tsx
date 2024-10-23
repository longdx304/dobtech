import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';
import { ProductProvider } from '@/lib/providers/product/product-provider';
import { VariantImagesProvider } from '@/lib/providers/product/variant-images-provider';
import { FC } from 'react';
import ProductPreview from '../product-preview';
import Pagination from './pagination';

interface ProductListProps {
	page?: number;
}
const PAGE_SIZE = 24;

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
				<h2 className="flex justify-center items-center">Sản phẩm mới</h2>
				<div className="flex flex-col items-center gap-4 pb-16">
					{data.products?.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
							{data.products?.map((product, index) => (
								<ProductPreview
									key={product.id}
									data={product}
									region={region!}
								/>
							))}
						</div>
					)}

					<Pagination
						total={data.count}
						currentPage={page || 1}
						pageSize={PAGE_SIZE}
					/>
				</div>
			</VariantImagesProvider>
		</ProductProvider>
	);
};

export default ProductList;
