import ProductList from '@/modules/products/components/product-list';
import { CartWithCheckoutStep } from '@/types/medusa';
import { ProductPreviewType } from '@/types/product';
import { Customer, Region } from '@medusajs/medusa';
import Overview from './overview';

type Props = {
	cart: CartWithCheckoutStep | null;
	customer: Omit<Customer, 'password_hash'> | null;
	products: {
		products: ProductPreviewType[];
		count: number;
	};
	region: Region;
};

const CartTemplate = ({ cart, customer, products, region }: Props) => {
	return (
		<div className="py-6">
			<Overview cart={cart} customer={customer} className='pb-12' />
			<div className="flex-col space-y-2 py-4">
				<h2 className="w-full h-[50px] flex justify-center items-center bg-[#f6f6f6] mt-0 text-sm">
					⬥ Bạn có lẽ cũng thích ⬥
				</h2>
				<div className="px-4 lg:pb-16 pb-4">
					<ProductList data={products} region={region} />
				</div>
			</div>
		</div>
	);
};

export default CartTemplate;
