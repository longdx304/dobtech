'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import { useAdminProductInbounds } from '@/lib/hooks/api/product-inbound/queries';
import { ERoutes } from '@/types/routes';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import { TabsProps } from 'antd';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import InboundItem from '../components/inbound-item';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;
const ListInbound: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<FulfillSupplierOrderStt>(
		FulfillSupplierOrderStt.DELIVERED
	);

	const { supplierOrder } = useAdminProductInbounds({
		q: searchValue || undefined,
		offset,
		limit: DEFAULT_PAGE_SIZE,
		status: activeKey,
	});

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

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

	const handleClickDetail = (id: string) => {
		router.push(`${ERoutes.WAREHOUSE_INBOUND}/${id}`);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Đơn nhập hàng</Title>
				<Text className="text-gray-600">
					Trang danh sách các đơn nhập hàng.
				</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Title level={4}>Theo dõi các đơn hàng</Title>
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm đơn nhập kho..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-[300px]"
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
					dataSource={supplierOrder}
					renderItem={(item: SupplierOrder) => (
						<List.Item>
							<InboundItem item={item} handleClickDetail={handleClickDetail} />
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
					}}
				/>
			</Card>
		</Flex>
	);
};

export default ListInbound;
