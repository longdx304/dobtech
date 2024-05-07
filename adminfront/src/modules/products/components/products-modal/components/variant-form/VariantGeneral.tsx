import { FC } from 'react';
import { Row, Col, Form } from 'antd';
import { CircleAlert } from 'lucide-react';

import { Input } from '@/components/Input';
import { TooltipIcon } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { Select } from '@/components/Select';

type Props = {
	form: any;
	field: any;
};

const VariantGeneral: FC<Props> = ({ form, field }) => {
	const options = Form.useWatch('options', form) || undefined;
	return (
		<Row gutter={[16, 0]} className="w-full text-gray-500">
			<Col span={24}>
				<span>{'Cấu hình thông tin chung cho biến thể này.'}</span>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={[field.name, 'title']}
					rules={[
						{
							required: true,
							message: 'Tên sản phẩm phải có ít nhất 2 ký tự!',
						},
					]}
					label="Tên phiên bản"
					className="mb-2"
				>
					<Input placeholder="Màu trắng / XL..." />
				</Form.Item>
			</Col>
			<Col span={24}>
				<TooltipIcon
					title="Các tùy chọn được sử dụng để xác định màu sắc, kích thước, vv của biến thể."
					icon={<CircleAlert size={18} color="#E7B008" strokeWidth={2} />}
				>
					<Text className="text-sm text-gray-800 font-medium">{'Options'}</Text>
				</TooltipIcon>
			</Col>
			{options
				?.filter((item) => item)
				.map((option: any, index: number) => {
					const optionsSelect = option.values.map((value) => ({
						value,
						label: value,
					}));
					return (
						<Col span={12} key={index}>
							<Form.Item
								labelCol={{ span: 24 }}
								name={[field.name, 'options', index, 'value']}
								rules={[
									{
										required: true,
										message: `Giá trị ${option.title.toLowerCase()} phải tồn tại!`,
									},
								]}
								label={option.title}
								className="mb-2"
							>
								<Select
									placeholder={`Chọn một ${option.title.toLowerCase()}`}
									options={optionsSelect}
								/>
							</Form.Item>
						</Col>
					);
				})}
		</Row>
	);
};

export default VariantGeneral;
