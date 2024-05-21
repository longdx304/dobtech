'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Divider } from 'antd';
import SortProducts, { SortOptions } from './sort-products';

type RefinementListProps = {
  sortBy: SortOptions;
  search?: boolean;
  'data-testid'?: string;
  category?: any;
};

const RefinementList = ({
  sortBy,
  'data-testid': dataTestId,
  category,
}: RefinementListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  };

  // Get tree category
  const getAncestors = (targetNode: any, nodes: any, acc = []) => {
    let parentCategory = null;

    acc.push(targetNode as never);

    if (targetNode.parent_category_id) {
      parentCategory = nodes.find(
        (n: any) => n.id === targetNode.parent_category_id
      );

      acc = getAncestors(parentCategory, nodes, acc);
    }

    if (!parentCategory) {
      return acc.reverse();
    }

    return acc;
  };

  // Show list ancestors to Breadcrumb
  const ancestors = useMemo(() => {
    if (category && category.parent_category) {
      return getAncestors(category, [category, category.parent_category]);
    } else if (category) {
      return getAncestors(category, [category]);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Breadcrumb
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/' },
    ...ancestors.map((category: any) => ({
      title: category.name,
      // href: `/categories/${category.handle}`,
    })),
  ];

  return (
    <>
      <div className='flex items-baseline justify-between'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
          <Breadcrumb items={breadcrumbItems} />
        </h1>
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
      </div>
      <Divider />
    </>
  );
};

export default RefinementList;
