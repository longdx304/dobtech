'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Title, Text } from '@/components/Typography';
import { Search } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';
import debounce from 'lodash/debounce';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import { useAdminProductOutbounds } from '@/lib/hooks/api/product-outbound';
import OutboundItem from '../components/outbound-item';
import { Order, User } from '@medusajs/medusa';
import { FulfillmentStatus } from '@/types/order';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;
const ListOutbound: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<string>(
		FulfillmentStatus.NOT_FULFILLED
	);

	const { orders, isLoading, count } = useAdminProductOutbounds({
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
		setActiveKey(key);
	};

	const items: TabsProps['items'] = [
		{
			key: FulfillmentStatus.NOT_FULFILLED,
			label: 'Đang thực hiện',
		},
		{
			key: FulfillmentStatus.FULFILLED,
			label: 'Đã hoàn thành',
		},
	];

	const handleClickDetail = (id: string) => {
		router.push(`${ERoutes.WAREHOUSE_OUTBOUND}/${id}`);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Đơn hàng</Title>
				<Text className="text-gray-600">
					Trang danh sách các đơn nhập hàng.
				</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Title level={4}>Theo dõi các đơn hàng</Title>
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm đơn hàng..."
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
					dataSource={orders}
					loading={isLoading}
					renderItem={(item: Order & { handler: User }) => (
						<List.Item>
							<OutboundItem item={item} handleClickDetail={handleClickDetail} />
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						total: count,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} đơn hàng`,
					}}
					locale={{
						emptyText:
							activeKey === FulfillmentStatus.NOT_FULFILLED
								? 'Đã hoàn thành tất cả đơn hàng. Hãy kiểm tra tại tab "Đã hoàn thành"'
								: 'Chưa có đơn hàng nào hoàn thành. Hãy kiểm tra tại tab "Đang thực hiện"',
					}}
				/>
			</Card>
		</Flex>
	);
};

export default ListOutbound;
