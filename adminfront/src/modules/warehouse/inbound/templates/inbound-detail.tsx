'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Title } from '@/components/Typography';
import { useAdminProductInbound } from '@/lib/hooks/api/product-inbound/queries';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { ERoutes } from '@/types/routes';
import { FulfillSupplierOrderStt } from '@/types/supplier';
import { LineItem } from '@medusajs/medusa';
import { TabsProps } from 'antd';
import debounce from 'lodash/debounce';
import { ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import InboundDetailItem from '../components/inbound-detail-item';
import InboundModal from '../components/inbound-modal';

type Props = {
	id: string;
};

const DEFAULT_PAGE_SIZE = 10;
const InboundDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState();
	const [searchValue, setSearchValue] = useState<string>('');
	const [variantId, setVariantId] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<LineItem | null>(null);
	const { supplierOrder } = useAdminProductInbound(id);

	const [activeKey, setActiveKey] = useState<FulfillSupplierOrderStt>(
		FulfillSupplierOrderStt.DELIVERED
	);

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

	const handleClickDetail = (id: string | null, item: LineItem) => {
		setVariantId(id);
		setSelectedItem(item);
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
								handleClickDetail={(id) => handleClickDetail(id, item)}
							/>
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
					}}
				/>
				{state && variantId && selectedItem && (
					<InboundModal
						open={state}
						onClose={handleClose}
						variantId={variantId as string}
						item={selectedItem}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default InboundDetail;
