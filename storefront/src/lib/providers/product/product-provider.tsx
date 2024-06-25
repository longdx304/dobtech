'use client';
import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Region } from '@medusajs/medusa';

type TProductContext = {
  product: PricedProduct | null;
  setProduct: (product: PricedProduct) => void;
  region: Region | null;
	setRegion: (region: Region) => void;
};
const defaultProductContext: TProductContext = {
  product: null,
  setProduct: () => {},
  region: null,
  setRegion: () => {},
};

const ProductContext = React.createContext(defaultProductContext);

type Props = {
  productData?: PricedProduct;
	regionData?: Region;
};

export const ProductProvider = ({
  children,
  productData,
  regionData,
}: PropsWithChildren & Props) => {
  const [product, setProduct] = useState<PricedProduct | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    // Fetch product data
		if (productData) {
			setProduct(productData);
		}
		if (regionData) {
			setRegion(regionData)
		}
  }, [productData, regionData]);

  return (
    <ProductContext.Provider value={{ product, setProduct, region, setRegion }}>
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
