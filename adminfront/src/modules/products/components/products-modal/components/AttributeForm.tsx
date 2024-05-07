import { FC } from 'react';
import { Row, Col, Form } from 'antd';
import { CircleAlert } from 'lucide-react';

import { Input, InputNumber } from '@/components/Input';
import { TooltipIcon } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { Flex } from '@/components/Flex';

type Props = {
};

const AttributeForm: FC<Props> = ({ }) => {

	return (
		<Row gutter={[16, 4]} className="w-full text-gray-500">
			<Col span={24} className="text-[12px]">
				<span>
					{
						'Thông tin vận chuyển có thể được yêu cầu tùy thuộc vào nhà cung cấp dịch vụ vận chuyển của bạn, và có phải bạn đang vận chuyển quốc tế hay không.'
					}
				</span>
				<Flex vertical gap="2px" className="pt-4">
					<Text className="text-sm text-gray-800 font-medium">
						{'Kích thước'}
					</Text>
				</Flex>
			</Col>
			<Col span={6}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['dimensions', 'width']}
					label="Chiều rộng"
					className="mb-2"
				>
					<InputNumber placeholder="100.." />
				</Form.Item>
			</Col>
			<Col span={6}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['dimensions', 'length']}
					label="Chiều dài"
					className="mb-2"
				>
					<InputNumber placeholder="100.." />
				</Form.Item>
			</Col>
			<Col span={6}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['dimensions', 'height']}
					label="Chiều cao"
					className="mb-2"
				>
					<InputNumber placeholder="100.." />
				</Form.Item>
			</Col>
			<Col span={6}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['dimensions', 'weight']}
					label="Trọng lượng"
					className="mb-2"
				>
					<InputNumber placeholder="100.." />
				</Form.Item>
			</Col>
			<Col span={24} className="text-[12px]">
				<Flex vertical gap="2px" className="pt-4">
					<Text className="text-sm text-gray-800 font-medium">
						{'Hải quan'}
					</Text>
				</Flex>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['customs', 'mid_code']}
					label="Mã MID"
					tooltip={{ title: 'Mã số điểm tiếp nhận', icon: <CircleAlert size={18} /> }}
					className="mb-2"
				>
					<Input placeholder="BDJSK39277W..." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['customs', 'hs_code']}
					label="Mã HS"
					tooltip={{ title: 'Mã hệ thống phân loại hàng hóa', icon: <CircleAlert size={18} /> }}
					className="mb-2"
				>
					<Input placeholder="XDSKLAD9999.." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['customs', 'origin_country']}
					label="Quốc gia xuất xứ"
					className="mb-2"
				>
					<Select placeholder="Chọn một quốc gia" options={[]} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default AttributeForm;
