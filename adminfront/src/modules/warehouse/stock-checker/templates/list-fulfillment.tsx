'use client';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import { useAdminFulfillments } from '@/lib/hooks/api/fulfullment';
import { Fulfillment } from '@/types/fulfillments';
import { ERoutes } from '@/types/routes';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import StockItem from '../components/stock-item';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const ListFulfillment: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<boolean>(false);

	const { fulfillments, isLoading, count } = useAdminFulfillments({
		q: searchValue || undefined,
		offset,
		limit: DEFAULT_PAGE_SIZE,
		expand: 'order,order.customer,order.shipping_address',
		isDone: activeKey,
	});

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const handleClickDetail = async (item: Fulfillment) => {
		return router.push(`${ERoutes.WAREHOUSE_STOCK_CHECKER}/${item.id}`);
	};

	const items: any = [
		{
			key: false,
			label: 'Chờ kiểm hàng',
		},
		{
			key: true,
			label: 'Đã kiểm hàng',
		},
	];

	const handleChangeTab = (key: boolean) => {
		setActiveKey(key);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Danh sách đơn hàng</Title>
				<Text className="text-gray-600">
					Trang danh sách các đơn cần kiểm hàng.
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
					defaultActiveKey={activeKey as any}
					items={items}
					onChange={handleChangeTab as any}
					centered
				/>
				<List
					grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
					dataSource={fulfillments}
					loading={isLoading}
					renderItem={(item: Fulfillment) => (
						<List.Item>
							<StockItem item={item} handleClickDetail={handleClickDetail} />
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
						emptyText: !activeKey
							? 'Đã hoàn thành tất cả đơn hàng. Hãy kiểm tra tại tab "Đã kiểm hàng"'
							: 'Chưa có đơn hàng nào hoàn thành. Hãy kiểm tra tại tab "Chờ kiểm hàng"',
					}}
				/>
			</Card>
		</Flex>
	);
};

export default ListFulfillment;
