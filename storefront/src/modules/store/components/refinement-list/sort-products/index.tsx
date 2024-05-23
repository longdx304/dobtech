'use client';

import FilterRadioGroup from '@/modules/common/components/filter-radio-group';
import { ProductCategory } from '@medusajs/medusa';
import { useMemo, useState, useEffect } from 'react';
import { useProductCategories } from 'medusa-react';
import FilterVariant from '@/modules/common/components/filter-variant';
import { Divider } from 'antd';

export type SortOptions = 'price_asc' | 'price_desc' | 'created_at';

type SortProductsProps = {
  sortBy: SortOptions;
  setQueryParams: (name: string, value: SortOptions) => void;
  'data-testid'?: string;
};

const sortOptions = [
  {
    value: 'created_at',
    label: 'Mới nhất',
  },
  {
    value: 'price_asc',
    label: 'Giá: Thấp -> Cao',
  },
  {
    value: 'price_desc',
    label: 'Giá: Cao -> Thấp',
  },
];

const SortProducts = ({
  'data-testid': dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams('sortBy', value);
  };

  return (
    <>
      <FilterRadioGroup
        items={sortOptions}
        value={sortBy}
        handleChange={handleChange}
        data-testid={dataTestId}
      />
      <FilterVariant />
      <Divider />
    </>
  );
};

export default SortProducts;
