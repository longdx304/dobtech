import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import dayjs from 'dayjs';
import { Check, Clock } from 'lucide-react';

type InboundItemProps = {
	item: SupplierOrder;
	handleClickDetail: (id: string) => void;
};

const InboundItem: React.FC<InboundItemProps> = ({
	item,
	handleClickDetail,
}) => {
	const isProcessing =
		item.fulfillment_status === FulfillSupplierOrderStt.DELIVERED;

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
				<Text className="text-sm font-semibold">{`#${item.display_id}`}</Text>
			</Flex>
			<Flex gap={4} className="py-2" align="center">
				<Text className="text-[14px] text-gray-500">Ngày nhập hàng:</Text>
				<Text className="text-sm font-semibold">
					{dayjs(item.created_at).format('DD/MM/YYYY')}
				</Text>
			</Flex>
			<Button className="w-full" onClick={handleClick}>
				{isProcessing ? 'Nhập hàng' : 'Chi tiết'}
			</Button>
		</Card>
	);
};

export default InboundItem;
