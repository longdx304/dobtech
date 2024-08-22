import { Flex } from '@/components/Flex';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { getPercentageDiff } from '@/lib/utils/get-precentage-diff';
import { formatAmount } from '@/lib/utils/prices';
import { LineItem, Region } from '@medusajs/medusa';
import { ChevronDown } from 'lucide-react';

import { CalculatedVariant } from 'types/medusa';

type LineItemUnitPriceProps = {
	item: Omit<LineItem, 'beforeInsert'>;
	region: Region;
	type?: 'full' | 'preview';
};

const LineItemUnitPrice = ({
	item,
	region,
	type = 'full',
}: LineItemUnitPriceProps) => {
	const originalPrice = (item.variant as CalculatedVariant).original_price;
	const calculatedPriceInclTax = (item.variant as CalculatedVariant)
		.original_price_incl_tax;
	const hasReducedPrice = (originalPrice * item.quantity || 0) > item.total!;
	const reducedPrice = (item.total || 0) / item.quantity!;

	return (
		<Flex
			vertical
			justify="center"
			align="flex-start"
			className={`w-full ${hasReducedPrice && 'block'}`}
		>
			{type === 'full' && (
				<>
					{hasReducedPrice && (
						<Flex align="center" justify="center" gap={4}>
							<Text className="text-[12px] text-[#767676] line-through text-nowrap">
								{formatAmount({
									amount: calculatedPriceInclTax,
									region: region,
									includeTaxes: false,
								})}
							</Text>
							<Tooltip
								placement="top"
								title={
									<Text className="text-[10px] font-normal border-[#FFD9CE] border-[1px] border-solid text-[#FA6338] px-[3px] py-[2px]">
										-{getPercentageDiff(originalPrice, reducedPrice || 0)}%
									</Text>
								}
								className="cursor-pointer"
							>
								<Flex align="center" className="px-1.5 py-1 bg-[#FFECE9]">
									<Text className="text-[#FA6338] text-[10px] text-nowrap">
										Ước lượng
									</Text>
									<ChevronDown size={12} className="text-[#FA6338]" />
								</Flex>
							</Tooltip>
						</Flex>
					)}
					<Text
						className={`text-[16px] font-semibold text-nowrap ${
							hasReducedPrice ? 'text-[#FA6338]' : 'text-black'
						}`}
					>
						{formatAmount({
							amount: reducedPrice || item.unit_price || 0,
							region: region,
							includeTaxes: false,
						})}
					</Text>
				</>
			)}

			{type === 'preview' && (
				<>
					<Text
						className={`text-[14px] font-semibold text-nowrap pr-1 ${
							hasReducedPrice
								? 'text-[#FA6338]'
								: 'text-black text-center w-full'
						}`}
					>
						{formatAmount({
							amount: reducedPrice || item.unit_price || 0,
							region: region,
							includeTaxes: false,
						})}
					</Text>
					{hasReducedPrice && (
						<Text className="text-[10px] text-[#767676] line-through text-nowrap">
							{formatAmount({
								amount: calculatedPriceInclTax,
								region: region,
								includeTaxes: false,
							})}
						</Text>
					)}
				</>
			)}
		</Flex>
	);
};

export default LineItemUnitPrice;
