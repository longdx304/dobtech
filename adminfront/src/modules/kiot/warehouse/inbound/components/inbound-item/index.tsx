import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Order } from '@/types/order';
import dayjs from 'dayjs';
import { Check, Clock } from 'lucide-react';

type InboundItemProps = {
	item: any;
	handleConfirm: (item: any) => void;
	handleClickDetail: (item: any) => void;
	handleRemoveHandler: (item: any) => void;
	isProcessing: boolean;
	activeKey: string;
};

export enum InboundStatus {
	TEMPT = 1,
	FULFILLED = 3,
	CANCELLED = 4,
}

const getStatusConfig = (
	isProcessing: boolean,
	isStart: boolean,
	item: any
) => {
	const status = item?.status;
	const isCompleted = status === InboundStatus.FULFILLED;
	const isCancelled = status === InboundStatus.CANCELLED;

	if (isCompleted) {
		return {
			color: 'green',
			label: 'Đã hoàn thành',
			icon: <Check />,
		};
	}
	if (isCancelled) {
		return {
			color: 'red',
			label: 'Đã hủy',
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
	};
};

const getButtonConfig = (
	user: any,
	item: InboundItemProps['item'],
	activeKey: string
) => {
	const isCompleted = item?.status === InboundStatus.FULFILLED;
	const isCancelled = item?.status === InboundStatus.CANCELLED;

	const isDisabled = activeKey === '1' && !item.status_label;
	let label = 'Nhập kho';
	if (user?.id !== item?.handler_id) label = 'Chi tiết';
	if (isCancelled || isCompleted) label = 'Chi tiết';
	return {
		label,
		disabled: isDisabled,
	};
};

const getActions = (
	user: any,
	item: InboundItemProps['item'],
	isStart: boolean,
	isProcessing: boolean,
	handleConfirm: (item: Order) => void,
	handleRemoveHandler: (item: Order) => void
) => {
	return [
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
};

const InboundItem: React.FC<InboundItemProps> = ({
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
				className="w-fit flex items-center gap-1 p-2 rounded-lg"
			>
				<span className="text-[14px] font-semibold">{statusConfig.label}</span>
				{statusConfig.icon}
			</Tag>
			<Flex gap={4} className="pt-2" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-sm font-semibold">{`#${item.code}`}</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Ngày nhập hàng:</Text>
				<Text className="text-sm font-semibold">
					{dayjs(item?.createdDate ?? item?.created_at).format('DD/MM/YYYY')}
				</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Người xử lý:</Text>
				<Text className="text-sm font-semibold">
					{item?.handler_id
						? `${item.handler?.last_name ?? ''} ${
								item.handler?.first_name ?? ''
						  }`
						: 'Chưa xác định'}
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

export default InboundItem;
