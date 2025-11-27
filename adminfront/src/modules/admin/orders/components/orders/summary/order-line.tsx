import { LineItem } from '@medusajs/medusa';
import { ReservationItemDTO } from '@medusajs/types';

import { Tooltip } from '@/components/Tooltip';
import PlaceholderImage from '@/modules/admin/common/components/placeholder-image';
import { formatAmountWithSymbol } from '@/utils/prices';
import Image from 'next/image';

type OrderLineProps = {
	item: LineItem;
	currencyCode: string;
	reservations?: ReservationItemDTO[];
	isAllocatable?: boolean;
	paymentStt?: string;
	refetch?: () => void;
};

const OrderLine = ({ item, currencyCode }: OrderLineProps) => {
	const tooltipContent = `${item?.title} - ${item?.variant?.title} (${
		item?.variant?.sku || ''
	})`;
	return (
		<div className="group hover:bg-gray-50 transition-colors rounded-lg p-4 mb-3 flex justify-between items-center border border-gray-100 hover:border-gray-200 hover:shadow-sm">
			{/* Left section: Image and Product Info */}
			<div className="flex items-center space-x-4 flex-1 min-w-0">
				{/* Product Image */}
				<div className="rounded-lg flex h-[56px] w-[56px] overflow-hidden flex-shrink-0">
					{item.thumbnail ? (
						<Image
							src={item.thumbnail}
							height={56}
							width={56}
							alt={`Image summary ${item.title}`}
							className="object-cover rounded-lg border border-gray-200"
						/>
					) : (
						<PlaceholderImage className="rounded-lg border border-gray-200" />
					)}
				</div>

				{/* Product Details */}
				<div className="flex flex-col justify-center min-w-0 flex-1">
					<Tooltip title={tooltipContent}>
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-gray-900 text-sm truncate">
								{item.title}
							</span>
							{item?.variant && (
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 truncate">
										{item.variant.title}
									</span>
									{item.variant.sku && (
										<span className="text-xs text-gray-400 font-mono">
											SKU: {item.variant.sku}
										</span>
									)}
								</div>
							)}
						</div>
					</Tooltip>
				</div>
			</div>

			{/* Right section: Quantity and Pricing */}
			<div className="flex items-center gap-8 flex-shrink-0">
				{/* Quantity */}
				<div className="text-center">
					<div className="text-xs text-gray-500 mb-1">Số lượng</div>
					<div className="text-sm font-semibold text-gray-900">
						{item.quantity}
					</div>
				</div>

				{/* Unit Price */}
				<div className="text-right min-w-[100px]">
					<div className="text-xs text-gray-500 mb-1">Đơn giá</div>
					<div className="text-sm font-medium text-gray-700">
						{formatAmountWithSymbol({
							amount: Math.round(item?.total ?? 0) / item.quantity,
							currency: currencyCode,
							tax: [],
						})}
					</div>
				</div>

				{/* Subtotal */}
				<div className="text-right min-w-[120px]">
					<div className="text-xs text-gray-500 mb-1">Thành tiền</div>
					<div className="text-base font-bold text-gray-900">
						{formatAmountWithSymbol({
							amount: Math.round(item.total ?? 0),
							currency: currencyCode,
							tax: [],
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderLine;
