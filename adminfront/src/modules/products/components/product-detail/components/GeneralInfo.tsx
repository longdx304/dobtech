import { FC, useState } from 'react';
import { Product } from '@medusajs/medusa';
import { Row, Col } from 'antd';
import { Pencil, Trash2, Dot } from 'lucide-react';
import { useAdminSalesChannels } from 'medusa-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title, Text } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { Select } from '@/components/Select';
import { Tag } from '@/components/Tag';

type Props = {
	product: Product;
	loadingProduct: boolean;
};

const GeneralInfo: FC<Props> = ({ product, loadingProduct }) => {
	const { state, onOpen, onClose } = useToggleState(false);

	const actions = [
		{
			label: <span className="w-full">Chỉnh sửa</span>,
			key: 'edit',
			icon: <Pencil size={20} />,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'edit') {
			onOpen();
			return;
		}
	};

	return (
		<Card loading={loadingProduct} className="p-4">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Flex align="center" justify="space-between">
						<Title level={3}>{product?.title}</Title>
						<Flex align="center" justify="flex-end" gap="40px">
							<Select
								value={product?.status}
								suffixIcon={null}
								variant="borderless"
								className="w-[150px]"
								options={[
									{
										value: 'published',
										label: (
											<Flex justify="center" align="center" gap="2px">
												<Dot color="rgb(52 211 153)" />
												<Text>{'Đã xuất bản'}</Text>
											</Flex>
										),
									},
									{
										value: 'draft',
										label: (
											<Flex justify="center" align="center" gap="4px">
												<Dot color="rgb(156 163 175)" />
												<Text>{'Bản nháp'}</Text>
											</Flex>
										),
									},
								]}
							/>
							<ActionAbles actions={actions} onMenuClick={handleMenuClick} />
						</Flex>
					</Flex>
				</Col>
				<Col span={24}>
					<ProductTags product={product} />
					<ProductDetail product={product} />
					<ProductSalesChannels product={product} />
				</Col>
				<Col span={24}></Col>
			</Row>
		</Card>
	);
};

export default GeneralInfo;

const ProductTags = ({ product }: Props) => {
	if (product?.tags?.length === 0) {
		return null;
	}

	return (
		<Flex align='center' justify='flex-start' gap='small' className="my-4 flex flex-wrap">
			{product?.tags?.map((t) => (
				<Tag key={t.id} bordered={false} className="w-fit py-2 px-3 text-xs text-gray-500 bg-gray-100 font-semibold rounded-md">
					{t.value}
				</Tag>
			))}
		</Flex>
	);
};

const ProductDetail = ({ product }: { product: Product }) => {
	return (
		<>
			<Flex vertical gap="8px">
				<Text className="text-sm text-gray-500">{'Mô tả'}</Text>
				<Text className="text-sm font-semibold">{'Chi tiết'}</Text>
			</Flex>
			<Flex vertical gap="8px" className="w-full pt-4">
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Tiêu đề phụ'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.subtitle || '-'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Định danh'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.handle || '-'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Loại'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.type?.value || '-'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Bộ sưu tập'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.collection?.title || '-'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Danh mục'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.categories?.map((c) => c.name).join(', ') || '-'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Có thể giảm giá'}</Text>
					<Text className="text-sm text-gray-500">
						{product?.discountable ? 'Có' : 'Không'}
					</Text>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					gap="small"
					className="w-full"
				>
					<Text className="text-sm text-gray-500">{'Dữ liệu kỹ thuật'}</Text>
					<Text className="text-sm text-gray-500">{'-'}</Text>
				</Flex>
			</Flex>
		</>
	);
};

const ProductSalesChannels = ({ product }: { product: Product }) => {
	const { count } = useAdminSalesChannels();
	// const remainder = Math.max(product?.sales_channels?.length - 3, 0)
	return (
		<Flex vertical gap="8px" className="pt-4">
			<Text className="text-sm font-semibold">{'Các kênh bán hàng'}</Text>
			<Flex gap="middle">
				{product?.sales_channels?.map((channel) => (
					<Tag key={channel.id} className="w-fit py-2 px-3 text-xs">
						{channel.name}
					</Tag>
				))}
			</Flex>
			<Text className="text-sm text-gray-500">{`Có sẵn trong ${
				product?.sales_channels?.length || 0
			} trong tổng số ${count} Kênh bán hàng`}</Text>
		</Flex>
	);
};
