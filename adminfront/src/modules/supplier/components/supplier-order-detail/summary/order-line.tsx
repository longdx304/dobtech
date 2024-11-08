import { LineItem } from '@medusajs/medusa';
import { ReservationItemDTO } from '@medusajs/types';

import PlaceholderImage from '@/modules/common/components/placeholder-image';
import { formatAmountWithSymbol } from '@/utils/prices';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import useToggleState from '@/lib/hooks/use-toggle-state';
import EditPriceModal from './edit-price-modal';

type OrderLineProps = {
	item: LineItem;
	currencyCode: string;
	reservations?: ReservationItemDTO[];
	isAllocatable?: boolean;
	paymentStt?: string;
	refetch: () => void;
};

const OrderLine = ({
	item,
	currencyCode,
	reservations,
	isAllocatable = true,
	paymentStt = '',
	refetch,
}: OrderLineProps) => {
	const { state, onClose, onOpen } = useToggleState();

	return (
		<div className="hover:bg-gray-50 rounded-md mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px] cursor-pointer">
			<div className="flex justify-center items-center space-x-4">
				<div className="rounded-sm flex h-[48px] w-[36px] overflow-hidden">
					{item?.thumbnail ? (
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
						{item?.title}
					</span>
					{item?.variant && (
						<span className="font-normal text-gray-500 truncate">
							{`${item.variant.title}`}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-center">
				<div className="space-x-2 lg:space-x-4 2xl:space-x-6 mr-1 flex text-[12px]">
					<div className="flex items-center gap-2 font-normal text-gray-500">
						{['not_paid', 'awaiting', 'pending'].includes(paymentStt) && (
							<Pencil size={12} onClick={onOpen} />
						)}
						{formatAmountWithSymbol({
							// amount: item?.unit_price ?? 0,
							amount: (item?.subtotal ?? 0) / item?.quantity,
							currency: currencyCode,
							tax: [],
						})}
					</div>
					<div className="font-normal text-gray-500">x {item.quantity}</div>
					<div className="font-normal text-gray-900 min-w-[55px] text-right">
						{formatAmountWithSymbol({
							// amount: item.unit_price ?? 0,
							amount: item.subtotal ?? 0,
							currency: currencyCode,
							tax: [],
						})}
					</div>
				</div>
				{state && item && (
					<EditPriceModal
						state={state}
						handleCancel={onClose}
						handleOk={onClose}
						item={item!}
						currencyCode={currencyCode}
						initialAmount={(item?.total ?? 0) / item?.quantity}
						refetch={refetch}
					/>
				)}
			</div>
		</div>
	);
};

export default OrderLine;
