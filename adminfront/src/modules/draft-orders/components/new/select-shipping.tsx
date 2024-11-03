import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { extractOptionPrice } from '@/utils/prices';
import { Alert, Form, Spin } from 'antd';
import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';

const SelectShipping = () => {
	const [showCustomPrice, setShowCustomPrice] = useState(false);
	const { enableNext, disableNext } = useStepModal();
	const { context, form } = useNewDraftOrderForm();

	const { region, shippingOptions } = context;

	const currentCustomPrice = Form.useWatch('custom_shipping_price', form);

	useEffect(() => {
		if (!showCustomPrice && currentCustomPrice) {
			setShowCustomPrice(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCustomPrice]);

	const removeCustomPrice = () => {
		form.setFieldsValue({ custom_shipping_price: undefined });
		setShowCustomPrice(false);
	};

	const selectedShippingOption = Form.useWatch('shipping_option', form);

	useEffect(() => {
		if (!selectedShippingOption) {
			disableNext();
		}

		if (selectedShippingOption) {
			enableNext();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedShippingOption]);

	return (
		<div className="min-h-[705px]">
			<h3 className="inter-base-semibold">
				Shipping method{' '}
				<span className="inter-base-regular text-grey-50">
					(To {region?.name})
				</span>
			</h3>

			{region ? (
				!shippingOptions?.length ? (
					<Alert
						message="Attention!"
						description="You don't have any options for orders without shipping. Please add one (e.g. 'In-store fulfillment') with 'Show on website' unchecked in region settings and continue."
						type="warning"
						showIcon
						className="mt-6"
					/>
				) : (
					<Form form={form} layout="vertical">
						<Form.Item
							label="Choose a shipping method"
							name="shipping_option"
							rules={[
								{ required: true, message: 'Please select a shipping method' },
							]}
						>
							<Select
								placeholder="Select a shipping method"
								options={
									shippingOptions?.map((so) => ({
										value: so.id,
										label: `${so.name} - ${extractOptionPrice(
											so.amount!,
											region
										)}`,
									})) || []
								}
							/>
						</Form.Item>
						{/* <div className="mt-4">
							{!showCustomPrice && (
								<Button
									type="default"
									onClick={() => setShowCustomPrice(true)}
									disabled={!form.getFieldValue('shipping_option')}
								>
									Điều chỉnh giá
								</Button>
							)}
							{showCustomPrice && (
								<div className="flex items-center">
									<Form.Item
										label="Custom Price"
										name="custom_shipping_price"
										style={{ flex: 1 }}
									>
										<Input
											type="number"
											onChange={(e) =>
												form.setFieldsValue({
													custom_shipping_price:
														parseInt(e.target.value, 10) || 0,
												})
											}
											placeholder={`Enter custom price in ${region.currency_code}`}
										/>
									</Form.Item>
									<Button
										type="text"
										onClick={removeCustomPrice}
										className="text-grey-40 ml-2"
									>
										<TrashIcon size={20} />
									</Button>
								</div>
							)}
						</div> */}
					</Form>
				)
			) : (
				<div className="flex flex-1 items-center justify-center">
					<Spin />
				</div>
			)}
		</div>
	);
};

export default SelectShipping;
