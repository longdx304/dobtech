import { getProductsListWithSort } from '@/actions/products';
import { getRegion } from '@/actions/region';
import ProductPreview from '@/modules/products/components/product-preview';
import { SortOptions } from '../components/refinement-list/sort-products';

const PRODUCT_LIMIT = 12;

type PaginatedProductsParams = {
	limit: number;
	collection_id?: string[];
	category_id?: string[];
	id?: string[];
};

export default async function PaginatedProducts({
	sortBy,
	page,
	collectionId,
	categoryId,
	productsIds,
	countryCode,
}: {
	sortBy?: SortOptions;
	page: number;
	collectionId?: string;
	categoryId?: string;
	productsIds?: string[];
	countryCode: string;
}) {
	const region = await getRegion(countryCode);

	if (!region) {
		return null;
	}

	const queryParams: PaginatedProductsParams = {
		limit: PRODUCT_LIMIT,
	};

	if (collectionId) {
		queryParams['collection_id'] = [collectionId];
	}

	if (categoryId) {
		queryParams['category_id'] = [categoryId];
	}

	if (productsIds) {
		queryParams['id'] = productsIds;
	}

	const {
		response: { products, count },
	} = await getProductsListWithSort({
		page,
		queryParams,
		sortBy,
		countryCode,
	});

	return (
		<>
			{products?.length > 0 && (
				<div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4">
					{products?.map((product) => (
						<ProductPreview key={product.id} data={product} region={region} />
					))}
				</div>
			)}
		</>
	);
}
