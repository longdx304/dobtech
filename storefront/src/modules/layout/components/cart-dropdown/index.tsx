'use client';

import { BadgeButton, Button } from '@/components/Button';
import DeleteButton from '@/modules/common/components/delete-button';
import LineItemPrice from '@/modules/common/components/line-item-price';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import Thumbnail from '@/modules/products/components/thumbnail';
import { Cart } from '@medusajs/medusa';
import { Popover } from 'antd';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  );
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const { countryCode } = useParams();

  const open = () => setCartDropdownOpen(true);
  const close = () => setCartDropdownOpen(false);

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0) || 0;

  const itemRef = useRef<number>(totalItems || 0);

  const timedOpen = () => {
    open();

    const timer = setTimeout(close, 5000);

    setActiveTimer(timer);
  };

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer as NodeJS.Timeout);
    }

    open();
  };

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer as NodeJS.Timeout);
      }
    };
  }, [activeTimer]);

  const pathname = usePathname();

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes('/cart')) {
      timedOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current]);

  const content = (
    <div className='w-[420px]'>
      <div className='flex items-center justify-center'>
        <h3 className='text-xl'>Sản phẩm mới thêm</h3>
      </div>
      {cartState && cartState.items?.length ? (
        <>
          <div className='overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 p-px'>
            {cartState.items
              .sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1;
              })
              .map((item) => (
                <div
                  className='grid grid-cols-[122px_1fr] gap-x-4'
                  key={item.id}
                  data-testid='cart-item'
                >
                  <LocalizedClientLink
                    href={`products/${item.variant.product.handle}`}
                    className='w-24'
                  >
                    <Thumbnail thumbnail={item.thumbnail} size='square' />
                  </LocalizedClientLink>
                  <div className='flex flex-col justify-between flex-1'>
                    <div className='flex flex-col flex-1'>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-col overflow-ellipsis whitespace-nowrap w-[180px]'>
                          <h3 className='text-md overflow-hidden text-ellipsis'>
                            <LocalizedClientLink
                              href={`products/${item.variant.product.handle}`}
                              data-testid='product-link'
                            >
                              {item.title}
                            </LocalizedClientLink>
                          </h3>
                        </div>
                        <div className='flex justify-end'>
                          <LineItemPrice
                            region={cartState.region}
                            item={item}
                            style='tight'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span
                        data-testid='cart-item-quantity'
                        data-value={item.quantity}
                      >
                        Số lượng: {item.quantity}
                      </span>
                      <DeleteButton
                        id={item.id}
                        className='mt-1 bg-transparent'
                        data-testid='cart-item-remove-button'
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className='p-4 flex flex-col gap-y-4 text-sm'>
            {/* <div className='flex items-center justify-between'>
              <span className='text-sm font-semibold'>
                Subtotal <span className='font-normal'>(excl. taxes)</span>
              </span>
              <span
                className='text-lg'
                data-testid='cart-subtotal'
                data-value={cartState.subtotal || 0}
              >
                {formatAmount({
                  amount: cartState.subtotal || 0,
                  region: cartState.region,
                  includeTaxes: false,
                })}
              </span>
            </div> */}
            <LocalizedClientLink href='cart' passHref>
              <Button
                className='w-full'
                size='large'
                data-testid='go-to-cart-button'
              >
                Thanh toán
              </Button>
            </LocalizedClientLink>
          </div>
        </>
      ) : (
        <div>
          <div className='flex py-16 flex-col gap-y-4 items-center justify-center'>
            <Image
              src={'/images/empty-cart.png'}
              alt='Empty cart'
              width={100}
              height={100}
            />
            {/* <div>
              <LocalizedClientLink href='/store'>
                <>
                  <span className='sr-only'>Go to all products page</span>
                  <Button onClick={close}>Explore products</Button>
                </>
              </LocalizedClientLink>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className='h-full z-50'
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover content={content} trigger='hover'>
        <BadgeButton
          icon={<ShoppingCart className='stroke-2' />}
          count={totalItems}
          showZero
          offset={[0, 10]}
        />
      </Popover>
    </div>
  );
};

export default CartDropdown;
