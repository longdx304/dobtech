import { medusaClient } from '@/lib/database/config';
import { ProductPreviewType } from '@/types/product';
import { ProductCollection } from '@medusajs/medusa';
import { cache } from 'react';
import { getProductsList } from './products';

// Collection actions
export const getCollectionsList = cache(async function (
  offset: number = 0,
  limit: number = 100
): Promise<{ collections: ProductCollection[]; count: number }> {
  const collections = await medusaClient.collections
    .list({ limit, offset }, { next: { tags: ['collections'] } })
    .then(({ collections }) => collections)
    .catch((err) => {
      throw err;
    });

  const count = collections.length;

  return {
    collections,
    count,
  };
});

export const retrieveCollection = cache(async function (id: string) {
  return medusaClient.collections
    .retrieve(id, {
      next: {
        tags: ['collections'],
      },
    })
    .then(({ collection }) => collection)
    .catch((err) => {
      throw err;
    });
});

export const getCollectionByHandle = cache(async function (
  handle: string
): Promise<ProductCollection> {
  const collection = await medusaClient.collections
    .list({ handle: [handle] }, { next: { tags: ['collections'] } })
    .then(({ collections }) => collections[0])
    .catch((err) => {
      throw err;
    });

  return collection;
});

export const getProductsByCollectionHandle = cache(
  async function getProductsByCollectionHandle({
    pageParam = 0,
    limit = 100,
    handle,
    countryCode,
  }: {
    pageParam?: number;
    handle: string;
    limit?: number;
    countryCode: string;
    currencyCode?: string;
  }): Promise<{
    response: { products: ProductPreviewType[]; count: number };
    nextPage: number | null;
  }> {
    const { id } = await getCollectionByHandle(handle).then(
      (collection) => collection
    );

    const { response, nextPage } = await getProductsList({
      pageParam,
      queryParams: { collection_id: [id], limit },
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
  }
);
