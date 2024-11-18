import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import { Clock } from 'lucide-react';

type InboundItemProps = {
	item: SupplierOrder;
	handleClickDetail: (id: string) => void;
};

const InboundDetailItem: React.FC<InboundItemProps> = ({
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
				<Clock size={16} />
			</Tag>
			<Flex gap={2} vertical className="py-4">
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">Tên sản phẩm:</Text>
					<Text className="text-lg font-semibold">{`#${item.display_id}`}</Text>
				</Flex>
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">Số lượng hàng:</Text>
					<Text className="text-lg font-semibold">{`#${item.display_id}`}</Text>
				</Flex>
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">
						Số lượng đã nhập vào kho:
					</Text>
					<Text className="text-lg font-semibold">{`#${item.display_id}`}</Text>
				</Flex>
			</Flex>
			<Button className="w-full" onClick={handleClick}>
				{isProcessing ? 'Thêm sản phẩm vào kho' : 'Chỉnh sửa'}
			</Button>
		</Card>
	);
};

export default InboundDetailItem;
