'use client';

import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Divider } from 'antd';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import InputNumber from '@/components/Input/InputNumber';
import { addToCart } from '@/modules/cart/action';
import OptionSelect from '../option-select';
import { Minus, Plus } from 'lucide-react';

type ProductActionsProps = {
  product: PricedProduct;
  region: Region;
  disabled?: boolean;
};

export type PriceType = {
  calculated_price: string;
  original_price?: string;
  price_type?: 'sale' | 'default';
  percentage_diff?: string;
};

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const countryCode = (useParams().countryCode as string) ?? 'vn';

  const variants = product.variants;

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {};

    for (const option of product.options || []) {
      const firstVariantOption = option.values[0]?.value;
      if (firstVariantOption) {
        optionObj[option.id] = firstVariantOption;
      } else {
        Object.assign(optionObj, { [option.id]: undefined });
      }
    }

    setOptions(optionObj);
  }, [product]);

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue;

      const temp: Record<string, string> = {};

      for (const option of variant.options) {
        temp[option.option_id] = option.value;
      }

      map[variant.id] = temp;
    }

    return map;
  }, [variants]);

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined;

    for (const key of Object.keys(variantRecord)) {
      if (_.isEqual(variantRecord[key], options)) {
        variantId = key;
      }
    }

    return variants.find((v) => v.id === variantId);
  }, [options, variantRecord, variants]);

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id]);
    }
  }, [variants, variantRecord]);

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update });
  };

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (variant && !variant.manage_inventory) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (variant && variant.allow_backorder) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (variant?.inventory_quantity && variant.inventory_quantity > 0) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [variant]);

  const actionsRef = useRef<HTMLDivElement>(null);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return null;
    setIsAdding(true);

    await addToCart({
      variantId: variant.id,
      quantity: quantity,
      countryCode,
    });

    setIsAdding(false);
    console.log('added to cart')
  };

  // get the inventory quantity of a variant
  const getInventoryQuantity = (optionId: any, value: any, variants: any) => {
    const variant = variants.find((variant: any) =>
      variant.options.some(
        (opt: any) => opt.option_id === optionId && opt.value === value
      )
    );
    // Return the inventory quantity if variant is found
    return variant ? variant.inventory_quantity : 0;
  };

  const handleAddNumber = () => {
    setQuantity(quantity + 1);
  };

  const handleSubtractNumber = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    
  };
  const handleInputChange = (value: number) => {
    setQuantity(value);
  };

  return (
    <>
      <div className='flex flex-col gap-y-2 mt-1' ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className='flex flex-col gap-y-4'>
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      data-testid='product-options'
                      disabled={!!disabled || isAdding}
                    />

                    {/* quantity */}
                    <div className='flex flex-col gap-y-3 mt-4'>
                      <span className='text-sm'>Số lượng:</span>

                      <InputNumber
                        addonBefore={
                          <Button
                            onClick={handleSubtractNumber}
                            icon={<Minus />}
                            type='text'
                            className='hover:bg-transparent w-[24px]'
                          />
                        }
                        addonAfter={
                          <Button
                            onClick={handleAddNumber}
                            icon={<Plus />}
                            type='text'
                            className='hover:bg-transparent w-[24px]'
                          />
                        }
                        controls={false}
                        value={quantity}
                        className='max-w-[160px]'
                        onChange={handleInputChange as any}
                      />

                      <span>{`${getInventoryQuantity(
                        option.id,
                        options[option.id],
                        product.variants
                      )} sản phẩm có sẵn`}</span>
                    </div>
                  </div>
                );
              })}
              <Divider />
            </div>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant || !!disabled || isAdding}
          className='w-full h-10'
          isLoading={isAdding}
          data-testid='add-product-button'
        >
          {!variant
            ? 'Thêm vào giỏ hàng'
            : !inStock
            ? 'Hàng đã hết'
            : 'Thêm vào giỏ hàng'}
        </Button>
      </div>
    </>
  );
}
