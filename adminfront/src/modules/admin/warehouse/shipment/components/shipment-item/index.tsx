import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Fulfillment, FulfullmentStatus } from '@/types/fulfillments';
import clsx from 'clsx';
import { Bike, Check, Clock, Hash, MapPin, Phone, User } from 'lucide-react';

type ShipmentItemProps = {
	item: Fulfillment;
	handleClickDetail: (item: Fulfillment) => void;
	handleConfirm: (item: Fulfillment) => void;
	handleRemoveHandler: (item: Fulfillment) => void;
};

const ShipmentItem: React.FC<ShipmentItemProps> = ({
	item,
	handleClickDetail,
	handleConfirm,
	handleRemoveHandler,
}) => {
	const { user } = useUser();
	const isProcessing = ![
		FulfullmentStatus.SHIPPED,
		FulfullmentStatus.CANCELED,
	].includes(item?.status);
	const isStart = !item?.shipped_id;
	const order = item.order;
	const customer = order?.customer;

	const address = order?.shipping_address
		? [
				order.shipping_address.address_2,
				order.shipping_address.city,
				order.shipping_address.address_1,
				order.shipping_address.province,
				order.shipping_address.country_code,
		  ]
				.filter(Boolean)
				.join(' ')
		: 'Chưa có địa chỉ giao hàng';

	const shipper = item.shipper?.first_name || 'Chưa có người giao hàng';
	const actions = [
		{
			label: <span className="w-full">{'Thêm vào danh sách giao hàng'}</span>,
			key: 'handle',
			disabled: !isStart,
			onClick: () => handleConfirm(item),
		},
		{
			label: <span className="w-full">{'Xoá khỏi danh sách chờ'}</span>,
			key: 'remove',
			disabled: user?.id !== item?.shipped_id || isStart || !isProcessing,
			danger: true,
			onClick: () => handleRemoveHandler(item),
		},
	];

	const statusText = () => {
		switch (item.status) {
			case FulfullmentStatus.AWAITING:
				return 'Chờ xác nhận';
			case FulfullmentStatus.DELIVERING:
				return 'Đang giao';
			case FulfullmentStatus.SHIPPED:
				return 'Đã giao';
			case FulfullmentStatus.CANCELED:
				return 'Đã hủy';
			default:
				return 'N/A';
		}
	};

	const color = () => {
		switch (item.status) {
			case FulfullmentStatus.AWAITING:
				return 'gray';
			case FulfullmentStatus.DELIVERING:
				return 'gold';
			case FulfullmentStatus.SHIPPED:
				return 'green';
			case FulfullmentStatus.CANCELED:
				return 'red';
			default:
				return 'gray';
		}
	};

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={color()}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">{statusText()}</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex vertical gap={4} className="mt-2">
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Hash size={14} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">{order?.display_id ?? '-'}</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<User size={18} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{[customer?.last_name, customer?.first_name]
							.filter(Boolean)
							.join(' ') || 'Khách hàng không xác định'}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Phone size={18} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{customer?.phone || 'Không có SĐT'}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<MapPin color="#6b7280" width={18} height={18} />
					</div>
					<Text className="text-sm font-semibold">{address}</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Bike color="#6b7280" width={18} height={18} />
					</div>
					<Text
						className={clsx('text-sm font-semibold', {
							'text-red-500': !item?.shipped_id,
							'text-green-500': item?.shipped_id,
						})}
					>
						{shipper}
					</Text>
				</Flex>
			</Flex>
			<Flex gap={4} align="center" justify="space-between" className="mt-2">
				<Button className="w-full" onClick={() => handleClickDetail(item)}>
					{'Chi tiết'}
				</Button>
				<ActionAbles actions={actions as any} />
			</Flex>
		</Card>
	);
};

export default ShipmentItem;
