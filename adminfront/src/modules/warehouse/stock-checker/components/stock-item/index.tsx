import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { Fulfillment } from '@/types/fulfillments';
import { Check, Clock, Hash, MapPin, Phone, User } from 'lucide-react';

type StockItemProps = {
	item: Fulfillment;
	handleClickDetail: (item: Fulfillment) => void;
};

const StockItem: React.FC<StockItemProps> = ({ item, handleClickDetail }) => {
	const isProcessing = !item?.checked_at;

	const address = `${item.order.shipping_address?.address_2 ?? ''}, ${
		item.order.shipping_address?.city ?? ''
	}, ${item.order.shipping_address?.address_1 ?? ''}, ${
		item.order.shipping_address?.province ?? ''
	}, ${item.order.shipping_address?.country_code ?? ''}`;

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">
					{isProcessing ? 'Chờ kiểm hàng' : 'Đã kiểm hàng'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex vertical gap={4} className="mt-2">
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Hash size={14} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">{item.order.display_id}</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<User size={18} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">{`${
						item.order.customer.last_name ?? ''
					} ${item.order.customer.first_name ?? ''}`}</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Phone size={18} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{item.order.customer.phone}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<MapPin color="#6b7280" width={18} height={18} />
					</div>
					<Text className="text-sm font-semibold">{address}</Text>
				</Flex>
			</Flex>
			<Flex gap={4} align="center" justify="space-between" className="mt-2">
				<Button className="w-full" onClick={() => handleClickDetail(item)}>
					{isProcessing ? 'Bắt đầu kiểm hàng' : 'Chi tiết'}
				</Button>
			</Flex>
		</Card>
	);
};

export default StockItem;
