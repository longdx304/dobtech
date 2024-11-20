import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Popconfirm } from '@/components/Popconfirm';
import { Select } from '@/components/Select';
import { Text, Title } from '@/components/Typography';
import { LayeredModalContext } from '@/lib/providers/layer-modal-provider';
import { Col, Row } from 'antd';
import { Minus, Plus } from 'lucide-react';
import { useContext, useState } from 'react';
import VariantInventoryForm from '../variant-inventory-form';

type WarehouseFormProps = {
	warehouse: any;
	variantId: string;
};

const WarehouseForm = ({ warehouse, variantId }: WarehouseFormProps) => {
	return (
		<Card
			className="mt-2 shadow-none border-[1px] border-solid border-gray-300 rounded-[6px]"
			rounded
		>
			<Flex vertical gap={6}>
				<Text strong className="">
					Vị trí sản phẩm trong kho
				</Text>
				{warehouse.length === 0 && (
					<Text className="text-gray-500">
						Sản phẩm chưa có vị trí ở trong kho
					</Text>
				)}
				<Row gutter={[8, 8]}>
					{warehouse.map((item: any) => (
						<Col xs={24} sm={12} key={item.id}>
							<WarehouseItem item={item} />
						</Col>
					))}
				</Row>
			</Flex>
			<Flex vertical gap={6} className="mt-2">
				<Text strong className="">
					Tìm & thêm vị trí mới
				</Text>
				<Flex gap={4}>
					<Select
						className="flex-grow"
						options={[]}
						placeholder="Chọn vị trí"
					/>
					<Button className="w-fit h-[10]">Thêm</Button>
				</Flex>
			</Flex>
		</Card>
	);
};

export default WarehouseForm;

const WarehouseItem = ({ item }: { item: any }) => {
	const layeredModalContext = useContext(LayeredModalContext);

	const [unit, setUnit] = useState();
	const [unitQuantity, setUnitQuantiy] = useState<number>(0);
	const quantity = `${item.quantity / item.unit.quantity} ${item.unit.unit}`;

	const handleClickInbound = () => {
		layeredModalContext.push({
			title: `Nhập hàng vào vị trí (${item.location})`,
			onBack: () => layeredModalContext.pop(),
			footer: null,
			view: <VariantInventoryForm type="INBOUND" />,
		});
	};

	const handleClickOutbound = () => {
		layeredModalContext.push({
			title: `Lấy hàng ở vị trí (${item.location})`,
			onBack: () => layeredModalContext.pop(),
			footer: null,
			view: <VariantInventoryForm type="OUTBOUND" />,
		});
	};

	return (
		<Popconfirm
			title={`Thay đổi số lượng tại vị trí (${item.location})`}
			description={`Số lượng hiện tại: ${item.quantity}`}
			// isLoading={isLoading}
			cancelText="Lấy hàng"
			okText="Nhập hàng"
			handleOk={handleClickInbound}
			handleCancel={handleClickOutbound}
			icon={null}
		>
			<Button className="w-full">{`${quantity} (${item.location})`}</Button>
		</Popconfirm>
	);
};
