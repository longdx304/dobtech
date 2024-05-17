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
      <ul
        className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 list-none'
        data-testid='products-list'
      >
        {products.map((product: any) => {
          return (
            <li key={product.id}>
              <ProductPreview data={product} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
