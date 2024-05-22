'use client';

import { Collapse } from '@/components/Collapse';
import { Panel } from '@/components/Collapse/Collapse';
import { Text } from '@/components/Typography';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useState } from 'react';

type ProductTabsProps = {
  product: PricedProduct;
};

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(['0']);

  console.log('product', product);
  const tabs = [
    {
      label: 'CHI TIẾT SẢN PHẨM',
      component: <ProductInfoTab product={product} />,
    },
    {
      label: 'MÔ TẢ SẢN PHẨM',
      component: <ProductDescTab product={product} />,
    },
  ];

  const onTabChange = (key: string | string[]) => {
    setActiveKey(key);
  };

  return (
    <div className='w-full rounded shadow mt-2'>
      <Collapse activeKey={activeKey} onChange={onTabChange} ghost>
        {tabs.map((tab, i) => (
          <Panel header={tab.label} key={i}>
            {tab.component}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className='text-small-regular py-8'>
      <div className='grid grid-cols-2 gap-x-8'>
        <div className='flex flex-col gap-y-4'>
          <div>
            <span className='font-semibold'>Danh mục</span>
            <p>{product.material ? product.material : '-'}</p>
          </div>
          <div>
            <span className='font-semibold'>Chất liệu</span>
            <p>{product.material ? product.material : '-'}</p>
          </div>
          <div>
            <span className='font-semibold'>Xuất xứ</span>
            <p>{product.origin_country ? product.origin_country : '-'}</p>
          </div>
        </div>
        <div className='flex flex-col gap-y-4'>
          <div>
            <span className='font-semibold'>Chất liệu</span>
            <p>{product.type ? product.type.value : '-'}</p>
          </div>
          <div>
            <span className='font-semibold'>Trọng lượng</span>
            <p>{product?.weight ? `${product?.weight} g` : '-'}</p>
          </div>
          <div>
            <span className='font-semibold'>Kích thước phù hợp</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : '-'}
            </p>
          </div>
        </div>
      </div>
      {product.tags?.length ? (
        <div>
          <span className='font-semibold'>Tags</span>
        </div>
      ) : null}
    </div>
  );
};

const ProductDescTab = ({ product }: ProductTabsProps) => {
  return (
    <>
      <Text className='text-medium' data-testid='product-description'>
        {product.description}
      </Text>
    </>
  );
};

export default ProductTabs;
