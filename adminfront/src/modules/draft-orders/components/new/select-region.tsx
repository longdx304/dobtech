import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { extractOptionPrice } from '@/utils/prices';
import { Alert, Form, Select, Spin } from 'antd';
import { useAdminRegions } from 'medusa-react';
import { useEffect, useMemo } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';

const { Option } = Select;

const SelectRegion = () => {
	const { regions } = useAdminRegions();
	const { enableNext, disableNext } = useStepModal();
	const { form, context } = useNewDraftOrderForm();
	const { region, shippingOptions } = context;

	const reg = Form.useWatch('region', form);
	const selectedShippingOption = Form.useWatch('shipping_option', form);

	const regionOptions = useMemo(() => {
		if (!regions) return [];
		return regions.map((region) => ({
			label: region.name,
			value: region.id,
		}));
	}, [regions]);


	useEffect(() => {
		if (!reg || !selectedShippingOption) {
			disableNext();
		} else {
			enableNext();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reg, selectedShippingOption]);

	const handleRegionChange = (value: string) => {
		form.setFieldValue('region', value);
	};

	// Get default region id with value is VN
	const defaultRegionId = regionOptions.find((option) => option.label === 'Vietnam')?.value;

	useEffect(() => {
		if (defaultRegionId) {
			handleRegionChange(defaultRegionId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{/* Region */}
			<div className="flex flex-col">
				<h3 className="font-medium">Chọn khu vực</h3>
				<Form.Item
					name="region"
					label="Quốc gia"
					rules={[{ required: true, message: 'Please select a region' }]}
				>
					<Select placeholder="Chọn quốc gia" onChange={handleRegionChange}>
						{regionOptions.map((option) => {
							return (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							);
						})}
					</Select>
				</Form.Item>
			</div>

			{/* Shipping */}
			<div className="min-h-fit">
				<h3 className="font-medium">
					Phương thức vận chuyển{' '}
					<span className="font-medium text-grey-50">(tại {region?.name})</span>
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
								label="Chọn phương thức vận chuyển thích hợp"
								name="shipping_option"
								rules={[
									{
										required: true,
										message: 'Please select a shipping method',
									},
								]}
							>
								<Select
									placeholder="Vui lý chọn phương thức vận chuyển"
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
						</Form>
					)
				) : (
					<div className="flex flex-1 items-center justify-center">
						<Spin />
					</div>
				)}
			</div>
		</>
	);
};

export default SelectRegion;
