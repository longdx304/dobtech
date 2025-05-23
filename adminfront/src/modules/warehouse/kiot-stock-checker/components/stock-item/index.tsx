import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { FulfillmentStatus } from '@/types/fulfillments';
import dayjs from 'dayjs';
import { Check, Clock } from 'lucide-react';

type StockItemProps = {
	item: any;
	handleClickDetail: (item: any) => void;
	handleConfirm: (item: any) => void;
	handleRemoveHandler: (item: any) => void;
};

const StockItem: React.FC<StockItemProps> = ({
	item,
	handleClickDetail,
	handleConfirm,
	handleRemoveHandler,
}) => {
	const { user } = useUser();

	const isProcessing = [
		FulfillmentStatus.NOT_FULFILLED,
		FulfillmentStatus.EXPORTED,
	].includes(item.status as FulfillmentStatus);

	const isStart = isProcessing && !item?.checker_id;

	const actions = [
		{
			label: <span className="w-full">{'Thực hiện'}</span>,
			key: 'handle',
			disabled: !isStart,
			onClick: () => handleConfirm(item),
		},
		{
			label: <span className="w-full">{'Huỷ bỏ'}</span>,
			key: 'remove',
			disabled: user?.id !== item?.checker_id || isStart || !isProcessing,
			danger: true,
			onClick: () => handleRemoveHandler(item),
		},
	];

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">
					{isStart
						? 'Chờ xử lý'
						: isProcessing
						? 'Đang tiến hành'
						: 'Đã hoàn thành'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-sm font-semibold">{`#${item.code}`}</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Người đặt hàng:</Text>
				<Text className="text-sm font-semibold text-wrap">{`${
					item.customer_name || ''
				}`}</Text>
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
					{item?.checker_id ? `${item.checker?.first_name}` : 'Chưa xác định'}
				</Text>
			</Flex>
			<Flex gap={4} align="center" justify="space-between" className="mt-2">
				<Button
					className="w-full"
					onClick={() => handleClickDetail(item)}
					disabled={!item?.checker_id}
				>
					{user?.id === item?.checker_id ? 'Kiểm hàng' : 'Chi tiết'}
				</Button>
				<ActionAbles actions={actions as any} />
			</Flex>
		</Card>
	);
};

export default StockItem;
