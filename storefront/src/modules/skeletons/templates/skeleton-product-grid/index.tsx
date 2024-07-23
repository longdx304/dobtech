import repeat from '@/lib/utils/repeat';
import SkeletonProductPreview from '../../components/skeleton-product-preview';

const SkeletonProductGrid = () => {
	return (
		<ul
			className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4"
			// className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 list-none'
			data-testid="products-list-loader"
		>
			{repeat(8).map((index) => (
				<li key={index}>
					<SkeletonProductPreview />
				</li>
			))}
		</ul>
	);
};

export default SkeletonProductGrid;
