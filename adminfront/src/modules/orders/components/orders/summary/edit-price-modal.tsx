import { Input, InputNumber } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { currencies } from '@/types/currencies';
import { normalizeAmount, persistedPrice } from '@/utils/prices';
import { LineItem } from '@medusajs/medusa';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateLineItem } from '@/actions/line-items';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	item: LineItem;
	initialAmount?: number;
	currencyCode: string;
	refetch?: () => void;
}

type PriceFormData = {
	amount: number;
};

const getCurrencyInfo = (currencyCode?: string) => {
	if (!currencyCode) {
		return undefined;
	}
	const currencyInfo = currencies[currencyCode.toUpperCase()];
	return currencyInfo;
};

const EditPriceModal = ({
	state,
	handleOk,
	handleCancel,
	item,
	initialAmount = 0,
	currencyCode,
	refetch = () => {},
}: Props) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [form] = Form.useForm();

	useEffect(() => {
		if (initialAmount) {
			form.setFieldsValue({
				amount: normalizeAmount(currencyCode, initialAmount),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialAmount]);

	const onFinish = async (values: PriceFormData) => {
		try {
			setIsSubmitting(true);
			const taxRate = item.tax_lines[0]?.rate ?? 0;
			const preTaxAmount = Math.round(values.amount / (1 + taxRate / 100));

			await updateLineItem(item.id, {
				unit_price: persistedPrice(currencyCode, preTaxAmount),
			} as Partial<LineItem>);
			message.success(`${item.title} - Thay đổi giá thành công`);
			handleOk();
			refetch();
			form.resetFields();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelModal = () => {
		form.resetFields();
		handleCancel();
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			isLoading={isSubmitting}
			handleCancel={handleCancelModal}
			form={form}
		>
			<Title level={3} className="text-center">
				{'Thay đổi giá'}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-4">
				<div className="flex gap-4">
					<Form.Item
						labelCol={{ span: 24 }}
						// name="currency"
						label="Tiền tệ"
						className="w-[100px]"
					>
						<Input
							defaultValue={currencyCode.toUpperCase()}
							className="w-[100px]"
							disabled
						/>
					</Form.Item>
					<Form.Item
						labelCol={{ span: 24 }}
						name="amount"
						label="Giá tiền"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập số tiền muốn thay đổi',
							},
						]}
					>
						<InputNumber
							// max={+normalizeAmount(order.currency_code, refundable)}
							min={0}
							allowClear
							prefix={
								<span className="text-gray-500">
									{getCurrencyInfo(currencyCode)?.symbol_native}
								</span>
							}
						/>
					</Form.Item>
				</div>
			</Form>
		</SubmitModal>
	);
};

export default EditPriceModal;
