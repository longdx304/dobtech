import { medusaClient } from '@/lib/database/config';
import { ProductPreviewType } from '@/types/product';
import { ProductCategoryWithChildren } from '@/types/productCategory';
import { ProductCategory } from '@medusajs/medusa';
import { cache } from 'react';
import { getProductsList } from './products';

// Category actions
export async function listCategories() {
  const headers = {
    next: {
      tags: ['categories'],
    },
  } as Record<string, any>;

  return medusaClient.productCategories
    .list(
      { parent_category_id: 'null', include_descendants_tree: true },
      headers
    )
    .then(({ product_categories }) => product_categories)
    .catch((err) => {
      return null;
    });
}

export const getCategoriesList = cache(async function (
  offset: number = 0,
  limit: number = 100
): Promise<{
  product_categories: ProductCategoryWithChildren[];
  count: number;
}> {
  const { product_categories, count } = await medusaClient.productCategories
    .list({ limit, offset }, { next: { tags: ['categories'] } })
    .catch((err) => {
      throw err;
    });

  return {
    product_categories,
    count,
  };
});

export const getCategoryByHandle = cache(async function (
  categoryHandle: string[]
): Promise<{
  product_categories: ProductCategoryWithChildren[];
}> {
  const handles = categoryHandle.map((handle: string, index: number) =>
    categoryHandle.slice(0, index + 1).join('/')
  );

  const product_categories = [] as ProductCategoryWithChildren[];

  for (const handle of handles) {
    const category = await medusaClient.productCategories
      .list(
        {
          handle: handle,
        },
        {
          next: {
            tags: ['categories'],
          },
        }
      )
      .then(({ product_categories: { [0]: category } }) => category)
      .catch((err) => {
        return {} as ProductCategory;
      });

    product_categories.push(category);
  }

  return {
    product_categories,
  };
});

export const getProductsByCategoryHandle = cache(async function ({
  pageParam = 0,
  handle,
  countryCode,
}: {
  pageParam?: number;
  handle: string;
  countryCode: string;
  currencyCode?: string;
}): Promise<{
  response: { products: ProductPreviewType[]; count: number };
  nextPage: number | null;
}> {
  const { id } = await getCategoryByHandle([handle]).then(
    (res) => res.product_categories[0]
  );

  const { response, nextPage } = await getProductsList({
    pageParam,
    queryParams: { category_id: [id] },
    countryCode,
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });

  return {
    response,
    nextPage,
  };
});
