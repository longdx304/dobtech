import repeat from '@/lib/utils/repeat';
import ProductsSkeletonTemplate from './product-skeleton';

const SkeletonProductGrid = () => {
	return (
		<ul
			className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4"
			data-testid="products-list-loader"
		>
			{repeat(18).map((index) => (
				<li key={index}>
					<ProductsSkeletonTemplate />
				</li>
			))}
		</ul>
	);
};

export default SkeletonProductGrid;
