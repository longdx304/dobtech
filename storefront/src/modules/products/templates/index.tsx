import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';
import ProductTabs from '@/modules/products/components/product-tabs';
import ImageGallery from '@/modules/products/components/image-gallery';
import ProductActions from '@/modules/products/components/product-actions';

const RelatedProducts = dynamic(
	() => import('@/modules/products/components/related-products')
);

type ProductTemplateProps = {
	countryCode: string;
	handle: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
	countryCode,
	handle,
}) => {
	return (
		<>
			<div className="flex flex-col lg:flex-row justify-between w-full pb-8 gap-4">
				<div className="w-full lg:w-fit lg:flex-grow lg:pr-4">
					<ImageGallery />
				</div>
				<div className="w-full lg:w-full lg:flex-grow lg:pl-4">
					<ProductActions />
				</div>
			</div>

			<ProductTabs />
			{/* <ProductReviews /> */}
			<div
				className="my-16 small:my-32"
				data-testid="related-products-container"
			>
				<Suspense fallback={<SkeletonRelatedProducts />}>
					<RelatedProducts handle={handle} countryCode={countryCode} />
				</Suspense>
			</div>
		</>
	);
};

export default ProductTemplate;
