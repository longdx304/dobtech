import { ProductCategory } from '@medusajs/medusa';

export type TTreeCategories = {
	id: string;
	label: string;
	key: string;
  metadata?: Record<string, string>;
	children?: TTreeCategories[];
};

export type ProductCategoryWithChildren = Omit<
  ProductCategory,
  "category_children"
> & {
  category_children: ProductCategory[]
  category_parent?: ProductCategory
}
