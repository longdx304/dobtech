import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { FulfillmentStatus, Order } from '@medusajs/medusa';
import { Check, Clock } from 'lucide-react';

type OutboundItemProps = {
	item: Order;
	handleClickDetail: (id: string) => void;
};

const OutboundItem: React.FC<OutboundItemProps> = ({
	item,
	handleClickDetail,
}) => {
	const isProcessing =
		item.fulfillment_status === FulfillmentStatus.NOT_FULFILLED;

	const handleClick = () => {
		handleClickDetail(item.id);
	};

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg"
			>
				<span className="text-[14px] font-semibold">
					{isProcessing ? 'Đang tiến hành' : 'Đã hoàn thành'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex gap={4} className="py-2" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-lg font-semibold">{`#${item.display_id}`}</Text>
			</Flex>
			<Button className="w-full" onClick={handleClick}>
				{isProcessing ? 'Nhập hàng' : 'Chi tiết'}
			</Button>
		</Card>
	);
};

export default OutboundItem;
