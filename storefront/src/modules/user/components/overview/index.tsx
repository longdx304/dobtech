import { ProductPreviewType } from '@/types/product';
import { Region } from '@medusajs/medusa';
import OverviewDesktop from './OverviewDesktop';
import OverviewMobile from './OverviewMobile';

type OverviewProps = {
	products: {
		products: ProductPreviewType[];
		count: number;
	};
	region: Region;
};

const Overview = ({ products, region }: OverviewProps) => {
	return (
		<>
			<div className="hidden lg:block">
				<OverviewDesktop products={products} region={region} />
			</div>
			<div className="block lg:hidden">
				<OverviewMobile products={products} region={region} />
			</div>
		</>
	);
};

export default Overview;
