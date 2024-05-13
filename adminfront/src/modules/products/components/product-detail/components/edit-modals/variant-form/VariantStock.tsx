import { FC } from 'react';
import { Row, Col, Form } from 'antd';
import { CircleAlert } from 'lucide-react';

import { Input, InputNumber } from '@/components/Input';
import { TooltipIcon } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';

type Props = {
	form: any;
	field: any;
};

const VariantStock: FC<Props> = ({ form, field }) => {

	return (
		<Row gutter={[16, 4]} className="w-full text-gray-500">
			<Col span={24}>
				<span>{'Cấu hình tồn kho và hàng tồn kho cho biến thể này.'}</span>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name='sku'
					label="Đơn vị quản lý hàng tồn kho (SKU)"
					className="mb-2"
				>
					<Input placeholder="SUN-G, JK123..." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name='inventory_quantity'
					label="Số lượng trong kho"
					className="mb-2"
				>
					<InputNumber placeholder="100.." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name='ean'
					label="Mã EAN (Mã vạch)"
					className="mb-2"
				>
					<Input placeholder="123456789102..." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name='upc'
					label="Mã UPC (Mã vạch)"
					className="mb-2"
				>
					<Input placeholder="123456789104.." />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name='barcode'
					label="Mã vạch"
					className="mb-2"
				>
					<Input placeholder="123456789104.." />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item
					name='manage_inventory'
					label="Quản lý hàng tồn kho"
					initialValue={true}
					className="justify-end mb-0"
					colon={false}
				>
					<Switch className="float-right" />
				</Form.Item>
				<div className="text-gray-500 text-xs">{`Khi được chọn, hệ thống sẽ điều chỉnh hàng tồn kho khi có đơn đặt hàng và đơn trả hàng được tạo ra.`}</div>
			</Col>
			<Col span={24}>
				<Form.Item
					name='allow_backorder'
					label="Cho phép đặt hàng trước"
					initialValue={false}
					className="mb-0"
					colon={false}
				>
					<Switch className="float-right" />
				</Form.Item>
				<div className="text-gray-500 text-xs">{`Khi được chọn, sản phẩm sẽ có sẵn để mua dù sản phẩm đã hết hàng.`}</div>
			</Col>
		</Row>
	);
};

export default VariantStock;
