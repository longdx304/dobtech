import { Order } from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { CornerDownRight } from 'lucide-react';
import StatusIndicator from '@/modules/common/components/status-indicator';
import { Empty, Modal as AntdModal, message, Divider } from 'antd';
import dayjs from 'dayjs';
import { useAdminCapturePayment } from 'medusa-react';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/Button';
import { DisplayTotal } from '@/modules/orders/components/common';
import { formatAmountWithSymbol } from '@/utils/prices';
import useToggleState from '@/lib/hooks/use-toggle-state';
import RefundModal from './refund-modal';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
};

const Payment = ({ order, isLoading }: Props) => {
	const capturePayment = useAdminCapturePayment(order?.id! || '');
	const { state, onOpen, onClose } = useToggleState(false);

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	let labelBtn = 'Thu tiền';

	const confirmCapture = () => {
		AntdModal.confirm({
			title: 'Xác nhận hoàn tất thanh toán',
			content: 'Bạn có chắc chắn đã hoàn tất thanh toán?',
			onOk: async () => {
				await capturePayment.mutateAsync(void {}, {
					onSuccess: () => message.success('Đã hoàn tất thanh toán'),
					onError: (err) => message.error(getErrorMessage(err)),
				});
			},
		});
	};
	let action = () => {
		AntdModal.confirm({
			title: 'Xác nhận thu tiền',
			content: 'Bạn có chắc chắn đã thu tiền từ khách hàng?',
			onOk: async () => {
				await capturePayment.mutateAsync(void {}, {
					onSuccess: () => message.success('Đã thu tiền thành công'),
					onError: (err) => message.error(getErrorMessage(err)),
				});
			},
		});
	};

	const isSystemPayment = order?.payments?.some(
		(p) => p.provider_id === 'system'
	);

	const { payment_status } = order!;

	let shouldShowNotice = false;
	// If payment is a system payment, we want to show a notice
	if (payment_status === 'awaiting' && isSystemPayment) {
		shouldShowNotice = true;
	}

	if (payment_status === 'requires_action' && isSystemPayment) {
		shouldShowNotice = true;
	}

	switch (true) {
		case payment_status === 'captured' ||
			payment_status === 'partially_refunded': {
			labelBtn = 'Hoàn tiền';
			action = () => onOpen();
			break;
		}

		case shouldShowNotice: {
			action = () => message.info('Đơn hàng này đang chờ thanh toán tự động');
			break;
		}

		case payment_status === 'requires_action': {
			return null;
		}
		default:
			break;
	}

	const handleOkRefund = () => {
		onClose();
	};

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<div className="pb-2 flex flex-col lg:flex-row lg:justify-between">
					<Title level={4}>{`Thanh toán`}</Title>
					<div className="flex justify-end items-center gap-2 flex-wrap">
						<PaymentStatus status={order!.payment_status} />
						{order.payment_status === 'partially_refunded' && (
							<Button type="default" onClick={confirmCapture}>
								{'Hoàn tất thanh toán'}
							</Button>
						)}
						{order.payment_status !== 'canceled' && (
							<Button type="default" onClick={action}>
								{labelBtn}
							</Button>
						)}
					</div>
				</div>
			</div>
			<div className="pt-6">
				{order?.payments?.map((payment) => (
					<div key={payment.id} className="flex flex-col">
						<DisplayTotal
							currency={order.currency_code}
							totalAmount={payment.amount}
							totalTitle={payment.id}
							subtitle={`${dayjs(payment.created_at).format(
								'hh:mm DD MMM YYYY'
							)}`}
						/>
						{!!payment.amount_refunded && (
							<div className="mt-4 flex justify-between items-center text-xs">
								<div className="flex items-center">
									<div className="text-gray-400 mr-2">
										<CornerDownRight size={20} />
									</div>
									<div className="font-normal text-gray-900">
										{'Đã hoàn tiền'}
									</div>
								</div>
								<div className="flex items-center">
									<div className="font-normal text-gray-900 mr-3">
										-
										{formatAmountWithSymbol({
											amount: payment.amount_refunded,
											currency: order.currency_code,
										})}
									</div>
									<div className="font-normal text-gray-500">
										{order.currency_code.toUpperCase()}
									</div>
								</div>
							</div>
						)}
						<Divider className="my-2" />
						<div className="flex justify-between text-xs">
							<div className="font-semibold text-grey-90">
								{payment_status === 'captured'
									? 'Số tiền đã thanh toán'
									: 'Số tiền cần thanh toán'}
							</div>
							<div className="flex">
								<div className="font-semibold text-gray-900 mr-3">
									{formatAmountWithSymbol({
										amount: order.paid_total - order.refunded_total,
										currency: order.currency_code,
									})}
								</div>
								<div className="font-regular text-gray-500">
									{order.currency_code.toUpperCase()}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			{state && (
				<RefundModal
					state={state}
					handleOk={handleOkRefund}
					handleCancel={onClose}
					order={order}
				/>
			)}
		</Card>
	);
};

export default Payment;

const PaymentStatus = ({ status }: { status: Order['payment_status'] }) => {
	switch (status) {
		case 'captured':
			return (
				<StatusIndicator
					title="Đã thanh toán"
					variant="success"
					className="font-normal"
				/>
			);
		case 'partially_refunded':
			return (
				<StatusIndicator
					title="Một phần được hoàn lại"
					variant="success"
					className="font-normal"
				/>
			);
		case 'awaiting':
			return (
				<StatusIndicator
					title="Chờ thanh toán"
					variant="danger"
					className="font-normal"
				/>
			);
		case 'canceled':
			return (
				<StatusIndicator
					title="Đã huỷ"
					variant="danger"
					className="font-normal"
				/>
			);
		case 'requires_action':
			return (
				<StatusIndicator
					title="Yêu cầu thanh toán"
					variant="danger"
					className="font-normal"
				/>
			);
		default:
			return null;
	}
};
