'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Title, Text } from '@/components/Typography';
import { ArrowLeft, Search } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import InboundItem from '../components/inbound-item';
import debounce from 'lodash/debounce';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import InboundDetailItem from '../components/inbound-detail-item';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import useToggleState from '@/lib/hooks/use-toggle-state';
import InboundModal from '../components/inbound-modal';
import { LineItem } from '@medusajs/medusa';
import { useAdminProductInbound } from '@/lib/hooks/api/product-inbound/queries';

type Props = {
	id: string;
};

const DEFAULT_PAGE_SIZE = 10;
const InboundDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState();
	const [searchValue, setSearchValue] = useState<string>('');
	const [variantId, setVariantId] = useState<string | null>(null);

	const [activeKey, setActiveKey] = useState<FulfillSupplierOrderStt>(
		FulfillSupplierOrderStt.DELIVERED
	);

	const { supplierOrder } = useAdminProductInbound(id);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangeTab = (key: string) => {
		setActiveKey(key as FulfillSupplierOrderStt);
	};

	const items: TabsProps['items'] = [
		{
			key: FulfillSupplierOrderStt.DELIVERED,
			label: 'Đang chờ nhập kho',
		},
		{
			key: FulfillSupplierOrderStt.INVENTORIED,
			label: 'Đã hoàn thành',
		},
	];

	const handleClickDetail = (id: string | null) => {
		setVariantId(id);
		onOpen();
	};

	const handleClose = () => {
		setVariantId(null);
		onClose();
	};

	const handleChangePage = (page: number) => {
		console.log('page', page);
	};

	const handleBackToList = () => {
		router.push(ERoutes.WAREHOUSE_INBOUND);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Button
					onClick={handleBackToList}
					type="text"
					icon={<ArrowLeft size={18} color="rgb(107 114 128)" />}
					className="text-gray-500 text-sm flex items-center"
				>
					Danh sách đơn hàng
				</Button>
				{/* <Title level={3}>Nhập hàng</Title>
				<Text className="text-gray-600">
					Trang nhập hàng từ Container xuống.
				</Text> */}
			</Flex>
			<Card loading={false} className="w-full mb-10" bordered={false}>
				<Title level={4}>{`Đơn nhập hàng #${1}`}</Title>
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm biến thể sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-full sm:w-[300px]"
					/>
				</Flex>
				<Tabs
					defaultActiveKey={activeKey}
					items={items}
					onChange={handleChangeTab}
					centered
				/>
				<List
					grid={{ gutter: 12, xs: 1, sm: 2, lg: 3 }}
					dataSource={supplierOrder?.items}
					renderItem={(item: LineItem) => (
						<List.Item>
							<InboundDetailItem
								item={item}
								handleClickDetail={handleClickDetail}
							/>
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
					}}
				/>
				{state && variantId && (
					<InboundModal
						open={state}
						onClose={handleClose}
						variantId={variantId as string}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default InboundDetail;
