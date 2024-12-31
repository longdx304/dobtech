import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { useAdminCancelSupplierOrder } from '@/lib/hooks/api/supplier-order';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { getErrorMessage } from '@/lib/utils';
import StatusIndicator from '@/modules/common/components/status-indicator';
// import { useAdminCancelSupplierOrder } from '@/modules/supplier/hooks';
import { SupplierOrder } from '@/types/supplier';
import { Empty, message, Modal as AntdModal } from 'antd';
import dayjs from 'dayjs';
import { Ban, Pencil } from 'lucide-react';

type Props = {
	supplierOrder: SupplierOrder | undefined;
	isLoading: boolean;
};

const Information = ({ supplierOrder, isLoading }: Props) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const cancelOrder = useAdminCancelSupplierOrder(supplierOrder?.id!);

	const handleCancelOrder = () => {
		AntdModal.confirm({
			title: 'Xác nhận huỷ đơn hàng',
			content: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
			onOk: async () => {
				await cancelOrder.mutateAsync(undefined, {
					onSuccess: () => {
						message.success('Huỷ đơn hàng thành công');
					},
					onError: (error: any) => {
						message.error(getErrorMessage(error));
					},
				});
			},
		});
	};

	const actions = [
		{
			label: <span className="w-full">{'Huỷ đơn hàng'}</span>,
			key: 'cancel',
			icon: <Ban size={16} />,
			danger: true,
			onClick: handleCancelOrder,
		},
		{
			label: <span className="w-full">{'Chỉnh sửa thời gian đơn hàng'}</span>,
			key: 'edit',
			icon: <Pencil size={16} />,
			onClick: onOpen,
		},
	];

	return (
		<Card loading={isLoading} className="px-4">
			{!supplierOrder && <Empty description="Không tìm thấy đơn hàng" />}
			{supplierOrder && (
				<div>
					<Flex align="center" justify="space-between" className="pb-2">
						<Title level={4}>{`Đơn hàng #${supplierOrder?.display_id}`}</Title>
						<div className="flex justify-end items-center gap-4">
							<OrderStatus status={supplierOrder!.status as any} />
							<ActionAbles actions={actions} />
						</div>
					</Flex>
					<span className="text-gray-500 text-xs">
						{dayjs(supplierOrder.created_at).format('hh:mm D/MM/YYYY')}
					</span>
					<Flex vertical gap={4} className="pt-8">
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Email:</Text>
							<Text className="text-gray-500 text-sm">
								{supplierOrder?.user?.email}
							</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Điện thoại:</Text>
							<Text className="text-gray-500 text-sm">
								{supplierOrder?.supplier?.phone ?? '-'}
							</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">
								Ngày nhận hàng(dự kiến):
							</Text>
							<Text className="text-gray-500 text-sm">
								{dayjs(supplierOrder?.estimated_production_time).format(
									'DD/MM/YYYY'
								) ?? '-'}
							</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">
								Ngày thanh toán(dự kiến):
							</Text>
							<Text className="text-gray-500 text-sm">
								{dayjs(supplierOrder?.settlement_time).format('DD/MM/YYYY') ??
									'-'}
							</Text>
						</Flex>
					</Flex>
				</div>
			)}
		</Card>
	);
};

export default Information;

const OrderStatus = ({ status }: { status: SupplierOrder['status'] }) => {
	switch (status) {
		case 'completed':
			return (
				<StatusIndicator
					variant="success"
					title="Đã hoàn thành"
					className="font-normal"
				/>
			);
		case 'pending':
			return (
				<StatusIndicator
					variant="default"
					title="Đang xử lý"
					className="font-normal"
				/>
			);
		case 'canceled':
			return (
				<StatusIndicator
					variant="danger"
					title="Đã huỷ"
					className="font-normal"
				/>
			);
		case 'requires_action':
			return (
				<StatusIndicator
					variant="danger"
					title="Yêu cầu xử lý"
					className="font-normal"
				/>
			);
		default:
			return null;
	}
};

type EditModalProps = {
	state: boolean;
	close: () => void;
};

const ModalEditTimeOrder = ({ state, close }: EditModalProps) => {};
