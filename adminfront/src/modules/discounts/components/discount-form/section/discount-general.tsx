import { Discount } from '@medusajs/medusa';
import { useAdminRegions } from 'medusa-react';
import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useDiscountForm } from '../discount-form-context';
import { Col, Form, Row } from 'antd';
import { Loader } from 'lucide-react';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';

type GeneralProps = {
	discount?: Discount;
};

const General: FC<GeneralProps> = ({ discount }) => {
	const initialCurrency = discount?.regions?.[0].currency_code || undefined;
	const [fixedRegionCurrency, setFixedRegionCurrency] = useState<
		string | undefined
	>(initialCurrency);

	const { regions: opts, isLoading } = useAdminRegions();
	const { type, form } = useDiscountForm();
	const regions = Form.useWatch('regions', form) || undefined;

	useEffect(() => {
		if (type === 'fixed' && regions) {
			let id: string;

			if (Array.isArray(regions) && regions.length) {
				id = regions[0].value;
			} else {
				id = (regions as unknown as { label: string; value: string }).value; // if you change from fixed to percentage, unselect and select a region, and then change back to fixed it is possible to make useForm set regions to an object instead of an array
			}

			const reg = opts?.find((r) => r.id === id);

			if (reg) {
				setFixedRegionCurrency(reg.currency_code);
			}
		}
	}, [type, opts, regions]);

	const regionOptions = useMemo(() => {
		return opts?.map((r) => ({ value: r.id, label: r.name })) || [];
	}, [opts]);

	if (isLoading) {
		return <Loader className="animate-spin" />;
	}

	return (
		<Row gutter={[16, 8]}>
			<Col xs={24}>
				<Form.Item
					labelCol={{ span: 24 }}
					name="regions"
					label="Chọn khu vực hợp lệ"
					className="mb-0"
					rules={[
						{ required: true, message: 'Phải chọn ít nhất một khu vực.' },
					]}
				>
					<Select
						placeholder="Chọn một quốc gia"
						options={regionOptions}
						allowClear
					/>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name="code"
					label="Mã"
					className="mb-0"
					rules={[{ required: true, message: 'Yêu cầu nhập mã.' }]}
				>
					<Input placeholder="SUMMERSALE10" />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default General;
