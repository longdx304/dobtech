import { getCategoriesList } from '@/actions/productCategory';
import {
  getProductByHandle,
  getProductsList,
  retrievePricedProductById,
} from '@/actions/products';
import { getRegion, listRegions } from '@/actions/region';
import ProductTemplate from '@/modules/products/templates';
import { Region } from '@medusajs/medusa';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { handle: string | null };
};

export async function generateStaticParams() {
  const staticParams = await getCategoriesList().then((responses) =>
    responses.product_categories.map((category) => ({
      handle: category.handle,
    })
  )
  );

  return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params;

  const { product } = await getProductByHandle(handle ?? '').then(
    (product) => product
  );

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | DOB Ecommerce`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | DOB Ecommerce`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

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

export default async function ProductPage({ params }: Props) {
  const region = await getRegion('vn');

  if (!region) {
    return notFound();
  }

  const pricedProduct = await getPricedProductByHandle(
    params?.handle ?? '',
    region
  );

  if (!pricedProduct) {
    notFound();
  }

  return (
    <div className='w-full container pt-[8rem] box-border'>
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={'vn'}
      />
    </div>
  );
}
