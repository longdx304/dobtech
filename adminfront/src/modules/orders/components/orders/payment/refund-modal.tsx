import { Form, message } from 'antd';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Select } from '@/components/Select';
import { InputNumber, TextArea, Input } from '@/components/Input';
import { Order } from "@medusajs/medusa";
import { useAdminRefundPayment } from "medusa-react";
import { useMemo, useState } from "react";
import { currencies } from "@/types/currencies"
import { Option } from '@/types/shared';
import { getErrorMessage } from '@/lib/utils';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	order: Order;
};

type RefundMenuFormData = {
	// currency
  amount: number
  reason: string;
  note?: string
}

const getCurrencyInfo = (currencyCode?: string) => {
  if (!currencyCode) {
    return undefined
  }
  const currencyInfo = currencies[currencyCode.toUpperCase()]
  return currencyInfo;
}

const RefundModal = ({ state, handleOk, handleCancel, order }: Props) => {
	const [form] = Form.useForm();
	const { mutateAsync, isLoading } = useAdminRefundPayment(order.id)

  const refundable = useMemo(() => {
    return order.paid_total - order.refunded_total
  }, [order]);

	const onFinish = async (values: RefundMenuFormData) => {
		await mutateAsync({
			amount: values.amount,
			reason: values.reason,
			no_notification: true,
			note: values?.note || '',
		}, {
			onSuccess: () => {
				message.success('Đã hoàn tiền đơn hàng thành công');
				handleOk();
				form.resetFields();
			},
			onError: (error: any) => {
				message.error(getErrorMessage(error))
			},
		});
	};

	const parser = (value) => {
		return value.replace(/\$\s?|(,*)/g, '');
	};
	const formatter = (value) => {
		if (value) {
			return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		return value;
	};

	const handleCancelModal = () => {
		form.resetFields();
		handleCancel();
	}

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			isLoading={isLoading}
			handleCancel={handleCancelModal}
			form={form}
		>
			<Title level={3} className="text-center">
				{'Tạo đơn hoàn tiền'}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-4">
				<div className="flex gap-4">
					<Form.Item
						labelCol={{ span: 24 }}
						// name="currency"
						label="Tiền tệ"
						className="w-[100px]"
					>
						<Input defaultValue={order.currency_code.toUpperCase()} className="w-[100px]" disabled />
					</Form.Item>
					<Form.Item
						labelCol={{ span: 24 }}
						name="amount"
						label="Số tiền hoàn trả"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập số tiền hoàn trả',
							},
							// () => ({
							// 	validator(_, value) {
							// 		if (!value) {
							// 			return Promise.reject();
							// 		}
							// 		if (value > refundable) {
							// 			return Promise.reject("Số tiền hoàn trả không thể lớn hơn số tiền cần thành toán");
							// 		}
							// 		return Promise.resolve();
							// 	},
							// }),
						]}
					>
						<InputNumber
							max={refundable}
							min={1}
							allowClear
							prefix={<span className='text-gray-500'>{getCurrencyInfo(order.currency_code).symbol_native}</span>}
							formatter={formatter}
							parser={parser}
						/>
					</Form.Item>
				</div>
				<Form.Item labelCol={{ span: 24 }} name="reason" label="Lý do" initialValue={"discount"} >
					<Select
						options={[
							{ value: 'discount', label: 'Giảm giá' },
							{ value: 'other', label: 'Khác' },
						]}
					/>
				</Form.Item>
				<Form.Item labelCol={{ span: 24 }} name="note" label="Ghi chú">
					<TextArea	placeholder="Giảm giá cho khách hàng thân thiết" />
				</Form.Item>
			</Form>
		</SubmitModal>
	);
};

export default RefundModal;
