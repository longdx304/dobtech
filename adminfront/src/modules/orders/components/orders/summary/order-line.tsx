import { LineItem } from '@medusajs/medusa';
import { ReservationItemDTO } from '@medusajs/types';

import PlaceholderImage from '@/modules/common/components/placeholder-image';
import { formatAmountWithSymbol } from '@/utils/prices';
// import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
// import ReservationIndicator from "../../components/reservation-indicator/reservation-indicator"
import Image from 'next/image';

type OrderLineProps = {
	item: LineItem;
	currencyCode: string;
	reservations?: ReservationItemDTO[];
	isAllocatable?: boolean;
};

const OrderLine = ({
	item,
	currencyCode,
	reservations,
	isAllocatable = true,
}: OrderLineProps) => {
	// const { isFeatureEnabled } = useFeatureFlag()
	return (
		<div className="hover:bg-gray-50 rounded-md mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px]">
			<div className="flex justify-center items-center space-x-4">
				<div className="rounded-sm flex h-[48px] w-[36px] overflow-hidden">
					{item.thumbnail ? (
						<Image
							src={item.thumbnail}
							height={48}
							width={36}
							alt={`Image summary ${item.title}`}
							className="object-cover"
						/>
					) : (
						<PlaceholderImage />
					)}
				</div>
				<div className="flex max-w-[185px] flex-col justify-center text-[12px]">
					<span className="font-normal text-gray-900 truncate">
						{item.title}
					</span>
					{item?.variant && (
						<span className="font-normal text-gray-500 truncate">
							{`${item.variant.title}${
								item.variant.sku ? ` (${item.variant.sku})` : ''
							}`}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-center">
				<div className="md:space-x-2 lg:space-x-4 2xl:space-x-6 mr-3 flex text-[12px]">
					<div className="font-normal text-gray-500">
						{formatAmountWithSymbol({
							amount: (item?.total ?? 0) / item.quantity,
							currency: currencyCode,
							tax: [],
						})}
					</div>
					<div className="font-normal text-gray-500">
						x {item.quantity}
					</div>
					{/* {isFeatureEnabled("inventoryService") && isAllocatable && (
            <ReservationIndicator reservations={reservations} lineItem={item} />
          )} */}
					<div className="font-normal text-gray-900 min-w-[55px] text-right">
						{formatAmountWithSymbol({
							amount: item.total ?? 0,
							currency: currencyCode,
							tax: [],
						})}
					</div>
				</div>
				<div className="font-normal text-gray-500 text-[12px]">
					{currencyCode.toUpperCase()}
				</div>
			</div>
		</div>
	);
};

export default OrderLine;
