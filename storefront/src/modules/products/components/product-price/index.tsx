import { cn } from '@/lib/utils';
import { getProductPrice } from '@/lib/utils/get-product-price';
import { RegionInfo } from '@/types/product';
import {
	PricedProduct,
	PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';

export default function ProductPrice({
	product,
	variant,
	region,
	className,
	options,
	isDrawer = false,
}: {
	product: PricedProduct;
	variant?: PricedVariant;
	region?: RegionInfo;
	className?: string;
	options: Record<string, string>;
	isDrawer?: boolean;
}) {
	const { cheapestPrice, variantPrice } = getProductPrice({
		product,
		variantId: variant?.id,
		region,
	});

	const noPrice = !variant && Object.values(options).some((item) => !item);
	const selectedPrice = noPrice
		? cheapestPrice
		: variant
		? variantPrice
		: undefined;

	if (!selectedPrice) {
		return <span className={cn('text-xl font-bold')}>-</span>;
	}

	return (
		<div className="bg-white">
			<div
				className={cn(
					'flex items-center space-x-2',
					isDrawer && 'flex-col items-start space-x-0 space-y-1'
				)}
			>
				<span
					className={cn('text-xl font-bold', {
						'text-[#FA6338]': selectedPrice.price_type === 'sale',
					})}
				>
					{selectedPrice.calculated_price}
				</span>
				{selectedPrice.price_type === 'sale' && (
					<div className="flex items-center text-xs">
						<div className="px-1.5 py-1 bg-[#FFECE9] text-[#FA6338] ">
							Ước tính
						</div>
						<div className="font-bold bg-[#FFD9CE] text-[#FA6338] px-[3px] py-[2px] ">
							-{selectedPrice.percentage_diff}%
						</div>
						<span
							className="line-through ml-2 text-gray-500 text-xs"
							data-testid="original-product-price"
							data-value={selectedPrice.original_price_number}
						>
							{selectedPrice.original_price}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
