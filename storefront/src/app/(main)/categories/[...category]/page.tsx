import { getCategoryByHandle, listCategories } from '@/actions/productCategory';
import { listRegions } from '@/actions/region';
import CategoryTemplate from '@/modules/categories/templates';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { category: string[] };
  searchParams: {
    sortBy?: SortOptions;
    page?: string;
  };
};

export async function generateStaticParams() {
  const product_categories = await listCategories();

  if (!product_categories) {
    return [];
  }

  const categoryHandles = product_categories.map((category) => category.handle);

  const staticParams = categoryHandles
    .map((handle) => ({
      category: [handle],
    }))
    .flat();

  return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { product_categories } = await getCategoryByHandle(
      params.category
    ).then((product_categories) => product_categories);

    const title = product_categories
      .map((category) => category.name)
      .join(' | ');

    const description =
      product_categories[product_categories.length - 1].description ??
      `${title} category.`;

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.category.join('/')}`,
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page } = searchParams;

  const { product_categories } = await getCategoryByHandle(
    params.category
  ).then((product_categories) => product_categories);

  if (!product_categories) {
    notFound();
  }

  return (
    <div className='w-full container pt-[8rem]'>
      <CategoryTemplate
        categories={product_categories}
        sortBy={sortBy}
        page={page}
        countryCode={'vn'}
      />
    </div>
  );
}
