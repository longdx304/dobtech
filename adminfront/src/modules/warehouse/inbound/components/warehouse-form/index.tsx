import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Popconfirm } from '@/components/Popconfirm';
import { Select } from '@/components/Select';
import { Text, Title } from '@/components/Typography';
import { LayeredModalContext } from '@/lib/providers/layer-modal-provider';
import { Col, Row } from 'antd';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import VariantInventoryForm from '../variant-inventory-form';
import debounce from 'lodash/debounce';

type WarehouseFormProps = {
	warehouse: any;
	variantId: string;
};

type ValueType =
	| {
			key?: string;
			label: React.ReactNode;
			value: string | number;
	  }
	| [];

const WarehouseForm = ({ warehouse, variantId }: WarehouseFormProps) => {
	const [searchValue, setSearchValue] = useState<string | null>(null);

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue(value);
	}, 300);

	const options: ValueType = useMemo(() => {
		return [];
	}, []);

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
						placeholder="Chọn vị trí"
						options={[]}
						labelInValue
						filterOption={false}
						onSearch={debounceFetcher}
						notFoundContent={
							fetching ? (
								<LoaderCircle className="animate-spin" size="small" />
							) : null
						}
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
		<Flex
			align="center"
			gap="small"
			justify="center"
			className="border-solid border-[1px] border-gray-400 rounded-md py-2 bg-[#2F5CFF] hover:bg-[#3D74FF] cursor-pointer"
		>
			<Popconfirm
				title={`Lấy hàng tại vị trí (${item.location})`}
				description={<VariantInventoryForm type="OUTBOUND" />}
				// isLoading={isLoading}
				cancelText="Huỷ"
				okText="Xác nhận"
				handleOk={() => console.log('okText')}
				handleCancel={() => console.log('cancel')}
				icon={null}
			>
				<Button
					className="w-[24px] h-[24px] rounded-full"
					type="default"
					danger
					icon={<Minus size={16} />}
				/>
			</Popconfirm>
			<Text className="text-white">{`${quantity} (${item.location})`}</Text>
			<Popconfirm
				title={`Nhập hàng tại vị trí (${item.location})`}
				description={<VariantInventoryForm type="INBOUND" />}
				// isLoading={isLoading}
				cancelText="Huỷ"
				okText="Xác nhận"
				handleOk={() => console.log('okText')}
				handleCancel={() => console.log('cancel')}
				icon={null}
			>
				<Button
					className="w-[24px] h-[24px] rounded-full"
					color="primary"
					variant="outlined"
					icon={<Plus size={16} />}
				/>
			</Popconfirm>
		</Flex>
	);
};
