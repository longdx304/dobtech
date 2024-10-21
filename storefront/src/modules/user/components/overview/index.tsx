import dynamic from 'next/dynamic';
import OverviewPreview from './preview';
const ProductList = dynamic(
	() => import('@/modules/products/components/product-list')
);

const Overview = () => {
	return (
		<div data-testid="overview-page-wrapper">
			<OverviewPreview />
			{/* Products */}
			<div className="flex-col space-y-2 py-4">
				<h2 className="w-full h-[50px] flex justify-center items-center bg-[#f6f6f6] mt-0 text-sm">
					⬥ Bạn có lẽ cũng thích ⬥
				</h2>
				<div className="px-4 lg:pb-16 pb-4">
					<ProductList />
				</div>
			</div>
		</div>
	);
};

export default Overview;
