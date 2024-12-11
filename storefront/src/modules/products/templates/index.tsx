import dynamic from 'next/dynamic';
import React from 'react';

import ImageGallery from '@/modules/products/components/image-gallery';
import ProductActions from '@/modules/products/components/product-actions';
import ProductTabs from '@/modules/products/components/product-tabs';
import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';

const RelatedProducts = dynamic(
	() => import('@/modules/products/components/related-products'),
	{
		loading: () => <SkeletonRelatedProducts />,
	}
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
		<div data-testid="product-container">
			<div className="flex flex-col lg:flex-row justify-between w-full h-fit pb-8 gap-4">
				<div className="w-full h-full lg:w-1/2 lg:flex-grow lg:pr-4">
					<ImageGallery />
				</div>
				<div className="w-full h-full lg:w-1/2 lg:flex-grow lg:pl-16">
					<ProductActions />
				</div>
			</div>

			<ProductTabs />
			{/* <ProductReviews /> */}
			<div
				className="my-16 small:my-32"
				data-testid="related-products-container"
			>
				<RelatedProducts handle={handle} countryCode={countryCode} />
			</div>
		</div>
	);
};

export default ProductTemplate;
