'use client';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';

type TProductContext = {
  product: PricedProduct | null;
  setProduct: (product: PricedProduct) => void;
};
const defaultProductContext: TProductContext = {
  product: null,
  setProduct: () => {},
};

const ProductContext = React.createContext(defaultProductContext);

type Props = {
  productData: PricedProduct;
};

export const ProductProvider = ({
  children,
  productData,
}: PropsWithChildren & Props) => {
  const [product, setProduct] = useState<PricedProduct | null>(null);

  useEffect(() => {
    // Fetch product data
    setProduct(productData);
  }, [productData]);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
