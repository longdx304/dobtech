'use client';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Switch } from '@/components/Switch';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import {
	useListOrdersKiot,
	useUpdateOrderKiot,
} from '@/lib/hooks/api/product-outbound';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import { FulfillmentStatus } from '@/types/fulfillments';
import { ERoutes } from '@/types/routes';
import { message, Select } from 'antd';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import StockItem from '../components/stock-item';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const KiotStockChecker: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<string>(
		`${FulfillmentStatus.NOT_FULFILLED},${FulfillmentStatus.EXPORTED}`
	);
	const [sortOrder, setSortOrder] = useState<string>('-created_at');
	const [myOrder, setMyOrder] = useState(false);

	const { user } = useUser();

	const updateOrderKiot = useUpdateOrderKiot();

	const {
		orders: ordersInWarehouse,
		isLoading: isLoadingInWarehouse,
		count: countInWarehouse,
	} = useListOrdersKiot({
		status: activeKey,
		offset,
		limit: DEFAULT_PAGE_SIZE,
	});

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const items: any = [
		{
			key: `${FulfillmentStatus.NOT_FULFILLED},${FulfillmentStatus.EXPORTED}`,
			label: 'Chờ kiểm hàng',
		},
		{
			key: FulfillmentStatus.FULFILLED,
			label: 'Đã kiểm hàng',
		},
	];

	const handleChangeTab = (key: string) => {
		setActiveKey(key);
	};

	const handleClickDetail = async (item: any) => {
		return router.push(`${ERoutes.KIOT_WAREHOUSE_STOCK_CHECKER}/${item.id}`);
	};

	const handleConfirm = async (item: any) => {
		await updateOrderKiot.mutateAsync(
			{ id: item.id, data: { checker_id: user?.id, checker_at: new Date() } },
			{
				onSuccess: () => {
					router.push(`${ERoutes.KIOT_WAREHOUSE_STOCK_CHECKER}/${item.id}`);
				},
				onError: (err) => {
					message.error(getErrorMessage(err));
				},
			}
		);
	};

	const handleRemoveHandler = async (item: any) => {
		await updateOrderKiot.mutateAsync(
			{ id: item.id, data: { checker_id: null, checker_at: null } },
			{
				onSuccess: () => {
					message.success('Huỷ bỏ xử lý đơn hàng thành công');
				},
				onError: (err) => {
					message.error(getErrorMessage(err));
				},
			}
		);
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
				<Flex
					align="center"
					justify="space-between"
					className="py-4 lg:flex-row flex-col"
				>
					<Flex align="center" gap={8}>
						<Text className="text-gray-700 font-medium">Đơn hàng của tôi</Text>
						<Switch
							checked={myOrder}
							onChange={(checked) => setMyOrder(checked)}
						/>
						<Select
							defaultValue={sortOrder}
							onChange={(value) => setSortOrder(value as any)}
							options={[
								{ label: 'Ngày cũ nhất', value: 'created_at' },
								{ label: 'Ngày mới nhất', value: '-created_at' },
							]}
							className="w-[200px]"
							style={{ width: 200 }}
							placeholder="Sắp xếp theo"
							allowClear
							showSearch
							filterOption={(input, option) =>
								(option?.label ?? '')
									.toLowerCase()
									.includes(input.toLowerCase())
							}
						/>
					</Flex>
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
					dataSource={ordersInWarehouse}
					loading={isLoadingInWarehouse}
					renderItem={(item: any) => (
						<List.Item>
							<StockItem
								item={item}
								handleClickDetail={handleClickDetail}
								handleConfirm={handleConfirm}
								handleRemoveHandler={handleRemoveHandler}
							/>
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						total: countInWarehouse,
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

export default KiotStockChecker;
