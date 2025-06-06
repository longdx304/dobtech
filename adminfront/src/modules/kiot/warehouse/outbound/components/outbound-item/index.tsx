import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { FulfillmentStatus } from '@/types/fulfillments';
import { Order } from '@/types/order';
import dayjs from 'dayjs';
import { Check, Clock } from 'lucide-react';

interface OutboundItemProps {
	item: any;
	handleClickDetail: (item: any) => void;
	handleConfirm: (item: any) => void;
	handleRemoveHandler: (item: any) => void;
	isProcessing: boolean;
	activeKey: string;
}

const getStatusConfig = (
	isProcessing: boolean,
	isStart: boolean,
	item: any
) => {
	const isCompleted = item?.invoiceDelivery?.status !== 1;

	if (isCompleted) {
		return {
			color: 'green',
			label: 'Đã hoàn thành',
			icon: <Check />,
		};
	}

	return {
		color: isProcessing ? 'gold' : 'green',
		label: isStart
			? 'Chờ xử lý'
			: isProcessing
			? 'Đang tiến hành'
			: 'Đã hoàn thành',
		icon: isProcessing ? <Clock size={16} /> : <Check />,
	};
};

const getButtonConfig = (
	user: any,
	item: OutboundItemProps['item'],
	activeKey: string
) => {
	const isExportedOrFulfilled = (status: string) =>
		[FulfillmentStatus.EXPORTED, FulfillmentStatus.FULFILLED].includes(
			status as FulfillmentStatus
		);

	const isDisabled =
		(activeKey === '1' &&
			(!item.status_label || isExportedOrFulfilled(item.status_label))) ||
		(activeKey === '2' && isExportedOrFulfilled(item.status));

	return {
		label: user?.id === item?.handler_id ? 'Xuất kho' : 'Chi tiết',
		disabled: isDisabled,
	};
};

const getActions = (
	user: any,
	item: OutboundItemProps['item'],
	isStart: boolean,
	isProcessing: boolean,
	handleConfirm: (item: Order) => void,
	handleRemoveHandler: (item: Order) => void
) => [
	{
		label: <span className="w-full">{'Thực hiện'}</span>,
		key: 'handle',
		disabled: !isStart,
		onClick: () => handleConfirm(item),
	},
	{
		label: <span className="w-full">{'Huỷ bỏ'}</span>,
		key: 'remove',
		disabled: user?.id !== item?.handler_id || isStart || !isProcessing,
		danger: true,
		onClick: () => handleRemoveHandler(item),
	},
];

const OutboundItem: React.FC<OutboundItemProps> = ({
	item,
	handleClickDetail,
	handleConfirm,
	handleRemoveHandler,
	isProcessing,
	activeKey,
}) => {
	const { user } = useUser();
	const isStart =
		isProcessing && !item?.handler_id && item?.invoiceDelivery?.status === 1;

	const statusConfig = getStatusConfig(isProcessing, isStart, item);
	const buttonConfig = getButtonConfig(user, item, activeKey);
	const actions = getActions(
		user,
		item,
		isStart,
		isProcessing,
		handleConfirm,
		handleRemoveHandler
	);

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={statusConfig.color}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">{statusConfig.label}</span>
				{statusConfig.icon}
			</Tag>

			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-sm font-semibold">{`#${item?.code}`}</Text>
			</Flex>

			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Người đặt hàng:</Text>
				<Text className="text-sm font-semibold text-wrap">
					{item?.customerName || item?.customer_name || 'NA'}
				</Text>
			</Flex>

			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Ngày đặt hàng:</Text>
				<Text className="text-sm font-semibold">
					{dayjs(item?.createdDate).format('DD/MM/YYYY')}
				</Text>
			</Flex>

			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Người xử lý:</Text>
				<Text className="text-sm font-semibold">
					{item?.handler_id ? `${item.handler?.first_name}` : 'Chưa xác định'}
				</Text>
			</Flex>

			<Flex gap={4} align="center" justify="space-between" className="mt-2">
				<Button
					className="w-full"
					onClick={() => handleClickDetail(item)}
					disabled={buttonConfig.disabled}
				>
					{buttonConfig.label}
				</Button>
				<ActionAbles actions={actions as any} />
			</Flex>
		</Card>
	);
};

export default OutboundItem;
