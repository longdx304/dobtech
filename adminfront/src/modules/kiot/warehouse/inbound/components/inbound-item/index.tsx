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
	// isProcessing: boolean;
	// activeKey: string;
};

export enum InboundStatus {
	TEMPT = 1,
	PROCESSING = 2,
	FULFILLED = 3,
	CANCELLED = 4,
}

const getStatusConfig = (item: any) => {
	const status = item?.status;

	switch (status) {
		case InboundStatus.FULFILLED:
			return {
				color: 'green',
				label: 'Đã hoàn thành',
				icon: <Check />,
			};
		case InboundStatus.PROCESSING:
			return {
				color: 'gold',
				label: 'Đang tiến hành',
				icon: <Clock size={16} />,
			};
		case InboundStatus.CANCELLED:
			return {
				color: 'red',
				label: 'Đã hủy',
				icon: <Check />,
			};
		case InboundStatus.TEMPT:
		default:
			return {
				color: item?.handler_id ? 'gold' : 'blue',
				label: item?.handler_id ? 'Chờ xử lý' : 'Chưa có người xử lý',
				icon: <Clock size={16} />,
			};
	}
};

const getButtonConfig = (user: any, item: InboundItemProps['item']) => {
	const isCompleted = item?.status === InboundStatus.FULFILLED;
	const isCancelled = item?.status === InboundStatus.CANCELLED;

	return {
		label: user?.id === item?.handler_id ? 'Nhập kho' : 'Chi tiết',
		disabled: isCompleted || isCancelled,
	};
};

const getActions = (
	user: any,
	item: InboundItemProps['item'],
	handleConfirm: (item: Order) => void,
	handleRemoveHandler: (item: Order) => void
) => {
	const canExecute = item?.status === InboundStatus.TEMPT && item?.handler_id === user?.id;
	const canCancel = item?.status === InboundStatus.TEMPT && item?.handler_id === user?.id;
	const isCompleted = item?.status === InboundStatus.FULFILLED;
	const isCancelled = item?.status === InboundStatus.CANCELLED;

	return [
		{
			label: <span className="w-full">{'Thực hiện'}</span>,
			key: 'handle',
			// disabled: !canExecute || isCompleted || isCancelled,
			onClick: () => handleConfirm(item),
		},
		{
			label: <span className="w-full">{'Huỷ bỏ'}</span>,
			key: 'remove',
			// disabled: !canCancel || isCompleted || isCancelled,
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
}) => {
	const { user } = useUser();

	const statusConfig = getStatusConfig(item);

	const actions = getActions(
		user,
		item,
		handleConfirm,
		handleRemoveHandler
	);

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={statusConfig.color}
				className="w-fit flex items-center gap-1 p-2 rounded-lg"
			>
				<span className="text-[14px] font-semibold">
					{statusConfig.label}
				</span>
				{statusConfig.icon}
			</Tag>
			<Flex gap={4} className="pt-2" align="center">
				<Text className="text-[14px] text-gray-500">Mã đơn hàng:</Text>
				<Text className="text-sm font-semibold">{`#${item.code}`}</Text>
			</Flex>
			<Flex gap={4} className="" align="center">
				<Text className="text-[14px] text-gray-500">Ngày nhập hàng:</Text>
				<Text className="text-sm font-semibold">
					{dayjs(item.created_at).format('DD/MM/YYYY')}
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
					disabled={getButtonConfig(user, item).disabled}
				>
					{getButtonConfig(user, item).label}
				</Button>
				<ActionAbles actions={actions as any} />
			</Flex>
		</Card>
	);
};

export default InboundItem;
