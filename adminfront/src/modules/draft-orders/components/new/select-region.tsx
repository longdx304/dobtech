import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { Form, Select } from 'antd';
import { useAdminRegions } from 'medusa-react';
import { useEffect, useMemo } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';

const { Option } = Select;

const SelectRegion = () => {
	const { regions } = useAdminRegions();
	const { enableNext, disableNext } = useStepModal();
	const { form } = useNewDraftOrderForm();

	const reg = Form.useWatch('region', form);

	const regionOptions = useMemo(() => {
		if (!regions) return [];
		return regions.map((region) => ({
			label: region.name,
			value: region.id,
		}));
	}, [regions]);

	useEffect(() => {
		if (!reg) {
			disableNext();
		} else {
			enableNext();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reg]);

	const handleRegionChange = (value: string) => {
		form.setFieldValue('region', value);
	};

	return (
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
	);
};

export default SelectRegion;
