import { getProductsListWithSort } from '@/actions/products';
import { SortOptions } from '../components/refinement-list/sort-products';
import { getRegion } from '@/actions/region';
import ProductPreview from '@/modules/products/components/product-preview';

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
        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-6 gap-y-6'>
          {products?.map((product) => (
            <ProductPreview key={product.id} data={product} />
          ))}
        </div>
      )}
    </>
  );
}
