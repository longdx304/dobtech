'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import {
	removeDiscount,
	removeGiftCard,
	submitDiscountForm,
} from '@/modules/checkout/actions';
import { Cart } from '@medusajs/medusa';
import { Form, FormProps, message } from 'antd';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type DiscountCodeProps = {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

type FormDiscountProps = {
	code: string;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
	const [form] = Form.useForm();
	const { discounts, gift_cards, region } = cart;
	const [error, setError] = useState<string | null>(null);

	const appliedDiscount = useMemo(() => {
		if (!discounts || !discounts.length) {
			return undefined;
		}

		switch (discounts[0].rule.type) {
			case 'percentage':
				return `${discounts[0].rule.value}%`;
			case 'fixed':
				return `- ${formatAmount({
					amount: discounts[0].rule.value,
					region: region,
				})}`;

			default:
				return 'Free shipping';
		}
	}, [discounts, region]);

	const removeGiftCardCode = async (code: string) => {
		await removeGiftCard(code, gift_cards, cart?.id);
	};

	const removeDiscountCode = async () => {
		await removeDiscount(discounts[0].code, cart?.id);
	};

	const onFinish: FormProps<FormDiscountProps>['onFinish'] = async (values) => {
		try {
			await submitDiscountForm(values, cart?.id);
			message.success('Mã giảm giá đã được áp dụng');
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || 'Mã phiếu giảm giá không hợp lệ';
			setError(errorMessage);
			message.error('Mã phiếu giảm giá không hợp lệ');
		}
	};

	return (
		<Flex className="w-full">
			{appliedDiscount ? (
				<Flex className="w-full items-center">
					<Flex className="flex-col w-full">
						<Text>Discount applied:</Text>
						<Flex
							className="w-full max-w-full"
							align="center"
							justify="space-between"
							data-testid="discount-row"
						>
							<Text className="flex gap-x-1 items-baseline">
								<span>Code:</span>
								<span className="truncate" data-testid="discount-code">
									{discounts[0].code}
								</span>
								<span
									className="min-w-fit"
									data-testid="discount-amount"
									data-value={discounts[0].rule.value}
								>
									({appliedDiscount})
								</span>
							</Text>
							<Button
								className="flex items-center"
								onClick={removeDiscountCode}
								data-testid="remove-discount-button"
								size="middle"
							>
								<Trash2 size={14} />
								<span className="sr-only">Xóa mã giảm giá</span>
							</Button>
						</Flex>
					</Flex>
				</Flex>
			) : (
				<>
					<Form
						form={form}
						onFinish={onFinish}
						className="w-full flex items-center space-x-2"
					>
						<Form.Item
							name="code"
							className="max-w-2/3 w-full flex-1 m-1"
							help={error}
							validateStatus={error ? 'error' : undefined}
						>
							<Input
								placeholder="Mã giảm giá"
								type="text"
								autoFocus={false}
								data-testid="discount-input"
								size="small"
								className="p-1.5"
							/>
						</Form.Item>
						<Form.Item className="m-1">
							<Button
								type="primary"
								htmlType="submit"
								data-testid="discount-apply-button"
								size="middle"
							>
								Áp dụng
							</Button>
						</Form.Item>
					</Form>
				</>
			)}
		</Flex>
	);
};

export default DiscountCode;
