'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';

import SortProducts, { SortOptions } from './sort-products';

type RefinementListProps = {
  sortBy: SortOptions;
  search?: boolean;
  'data-testid'?: string;
};

const RefinementList = ({
  sortBy,
  'data-testid': dataTestId,
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
    router.replace(`${pathname}?${query}`);
  };

  return (
    <Suspense>
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </Suspense>
  );
};

export default RefinementList;
