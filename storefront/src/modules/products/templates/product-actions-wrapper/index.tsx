import {
  getProductByHandle,
  retrievePricedProductById,
} from '@/actions/products';
import { Region } from '@medusajs/medusa';
import ProductActions from '../../components/product-actions';
import { getRegion } from '@/actions/region';

const getPricedProductByHandle = async (handle: string, region: Region) => {
  const { product } = await getProductByHandle(handle).then(
    (product) => product
  );

  if (!product || !product.id) {
    return null;
  }

  const pricedProduct = await retrievePricedProductById({
    id: product.id,
    regionId: region.id,
  });

  return pricedProduct;
};

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  countryCode,
  handle,
}: {
  countryCode: string;
  handle: string;
}) {
  const region = await getRegion(countryCode);

  const pricedProduct = await getPricedProductByHandle(
    handle,
    region as Region
  );

  const product = await retrievePricedProductById({
    id: pricedProduct?.id as string,
    regionId: region?.id as string,
  });

  if (!product) {
    return null;
  }

  return <ProductActions product={product} region={region!} />
}
