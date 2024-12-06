import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { FulfillmentStatus, Order } from '@/types/order';
import dayjs from 'dayjs';
import { Check, Clock } from 'lucide-react';

type OutboundItemProps = {
	item: Order;
	handleClickDetail: (item: Order) => void;
};

const OutboundItem: React.FC<OutboundItemProps> = ({
	item,
	handleClickDetail,
}) => {
	const isProcessing = item.fulfillment_status !== FulfillmentStatus.FULFILLED;

	const handleClick = () => {
		handleClickDetail(item);
	};

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">
					{isProcessing ? 'Đang tiến hành' : 'Đã hoàn thành'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-sm font-semibold">{`#${item.display_id}`}</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Ngày đặt hàng:</Text>
				<Text className="text-sm font-semibold">
					{dayjs(item.created_at).format('DD/MM/YYYY')}
				</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Người xử lý:</Text>
				<Text className="text-sm font-semibold">
					{item?.handler_id
						? `${item.handler?.last_name} ${item.handler?.first_name}`
						: 'Chưa xác định'}
				</Text>
			</Flex>
			<Button className="w-full mt-2" onClick={handleClick}>
				{!item?.handler_id
					? 'Nhận xuất kho'
					: isProcessing
					? 'Xuất kho'
					: 'Chi tiết'}
			</Button>
		</Card>
	);
};

export default OutboundItem;