import { FC, useMemo } from 'react';
import { Product } from '@medusajs/medusa';
import { Row, Col, Empty } from 'antd';
import { Plus, CircleDollarSign, Settings } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title, Text } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import { Tag } from '@/components/Tag';
import useToggleState from '@/lib/hooks/use-toggle-state';
import variantsColumns from './variantsColumns';
import { Table } from '@/components/Table';
import PricesModal from './edit-modals/prices-modal';
import OptionModal from './edit-modals/OptionModal';

type Props = {
	product: Product;
	loadingProduct: boolean;
};

const VariantsInfo: FC<Props> = ({ product, loadingProduct }) => {
	const {
		state: statePrice,
		onOpen: onOpenPrice,
		onClose: onClosePrice,
	} = useToggleState(false);
	const {
		state: stateOption,
		onOpen: onOpenOption,
		onClose: onCloseOption,
	} = useToggleState(false);
	const actions = [
		{
			label: <span className="w-full">Thêm biến thể</span>,
			key: 'add-variants',
			icon: <Plus size={20} />,
		},
		{
			label: <span className="w-full">Chỉnh sửa giá</span>,
			key: 'edit-price',
			icon: <CircleDollarSign size={20} />,
			onClick: onOpenPrice,
		},
		{
			label: <span className="w-full">Chỉnh sửa tuỳ chọn</span>,
			key: 'edit-option',
			icon: <Settings size={20} />,
			onClick: onOpenOption,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		// if (key === 'edit-price') {
		// 	onOpenPrice();
		// 	return;
		// }
	};

	const columns = useMemo(() => variantsColumns({}), [product]);

	return (
		<Card loading={loadingProduct} className="p-4">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Flex align="center" justify="space-between">
						<Title level={3}>Variants</Title>
						<ActionAbles actions={actions} onMenuClick={handleMenuClick} />
					</Flex>
				</Col>
				{product?.options?.length ? (
					<Col span={24}>
						<RenderOptions product={product} />
						<Flex vertical gap="small" className="pt-8">
							<Text className="text-sm font-semibold">{`Biến thể sản phẩm (${
								product?.variants?.length || 0
							})`}</Text>
							<Table
								columns={columns}
								dataSource={product?.variants ?? []}
								rowKey="id"
								pagination={false}
							/>
						</Flex>
					</Col>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				)}
			</Row>
			<PricesModal
				product={product}
				state={statePrice}
				handleOk={onClosePrice}
				handleCancel={onClosePrice}
			/>
			<OptionModal
				product={product}
				state={stateOption}
				handleOk={onCloseOption}
				handleCancel={onCloseOption}
			/>
		</Card>
	);
};

export default VariantsInfo;

const RenderOptions = ({ product }: { product: Product }) => {
	return (
		<Flex gap="middle" className="w-full pt-2">
			{product?.options?.length &&
				product?.options.map((option) => (
					<Flex
						key={option.id}
						vertical
						align="center"
						justify="start"
						gap="small"
					>
						<Flex vertical gap="8px" className="w-full">
							<Text className="text-sm font-semibold">{option.title}</Text>
							<Flex align="center" gap="4px">
								{option?.values
									?.map((value) => value.value)
									.filter((v, index, self) => self.indexOf(v) === index)
									.map((value) => (
										<Tag
											key={value}
											className="text-xs font-semibold w-fit px-3 py-[6px] bg-[#F3F4F6] text-[#6b7280] rounded-lg"
											bordered={false}
										>
											{value}
										</Tag>
									))}
							</Flex>
						</Flex>
					</Flex>
				))}
		</Flex>
	);
};
