'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Switch } from '@/components/Switch';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import {
	useGetStockIn,
	useListOrdersKiot,
} from '@/lib/hooks/api/product-inbound/queries';
import { getErrorMessage } from '@/lib/utils';
import { OrderKiotType } from '@/types/kiot';
import { ERoutes } from '@/types/routes';
import { SupplierOrder } from '@/types/supplier';
import { message } from 'antd';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import InboundItem from '../components/inbound-item';
import { FulfillmentStatus } from '@/types/fulfillments';
import { useUnassignOrder } from '@/lib/hooks/api/product-inbound/mutations';
import { useAssignOrder } from '@/lib/hooks/api/product-inbound';

type Props = {};

const SORT_ORDER = {
	1: {
		orderBy: 'createdDate',
		orderDirection: 'DESC',
	},
	2: {
		orderBy: 'createdDate',
		orderDirection: 'ASC',
	},
	3: {
		orderBy: 'displayId',
		orderDirection: 'DESC',
	},
	4: {
		orderBy: 'displayId',
		orderDirection: 'ASC',
	},
};

const DEFAULT_PAGE_SIZE = 10;
const ListInbound: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [myOrder, setMyOrder] = useState(false);
	const [sortOrder, setSortOrder] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<string>('2');

	const {
		orders: ordersInWarehouse,
		isLoading: isLoadingInWarehouse,
		count: countInWarehouse,
	} = useListOrdersKiot({
		offset,
		limit: DEFAULT_PAGE_SIZE,
		type: OrderKiotType.INBOUND,
	});

	const { orders: ordersFromKiot, isLoading: isLoadingFromKiot } =
		useGetStockIn({
			offset,
			limit: DEFAULT_PAGE_SIZE,
			...SORT_ORDER[sortOrder as keyof typeof SORT_ORDER],
		});
	const assignOrder = useAssignOrder();
	const unassignOrder = useUnassignOrder();
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

	const items: any = [
		{
			key: '2',
			label: 'Đơn hàng trong kho',
		},
		{
			key: '1',
			label: 'Đơn hàng trên KiotViet',
		},
	];

	const handleClickDetail = async (item: any) => {
		return router.push(`${ERoutes.KIOT_WAREHOUSE_INBOUND}/${item.id}`);
	};

	const handleConfirm = async (item: any) => {
		await assignOrder.mutateAsync(
			{ id: item.id, type: OrderKiotType.INBOUND },
			{
				onSuccess: () => {
					message.success('Thêm nhân viên xử lý đơn hàng thành công');
				},
				onError: (err: any) => {
					message.error(getErrorMessage(err));
				},
			}
		);
	};

	const handleRemoveHandler = async (item: any) => {
		console.log('🚀 ~ handleRemoveHandler ~ item:', item);
		await unassignOrder.mutateAsync(
			{ id: item.id },
			{
				onSuccess: () => {
					message.success('Huỷ bỏ nhân viên xử lý đơn hàng thành công');
				},
				onError: (err: any) => {
					message.error(getErrorMessage(err));
				},
			}
		);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Đơn nhập kho</Title>
				<Text className="text-gray-600">Trang danh sách các đơn nhập kho.</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Title level={4}>Theo dõi các đơn hàng</Title>
				<Flex align="center" justify="space-between" className="py-4">
					<Flex align="center" gap={8}>
						<Text className="text-gray-700 font-medium">Đơn hàng của tôi</Text>
						<Switch
							checked={myOrder}
							onChange={(checked) => setMyOrder(checked)}
						/>
					</Flex>
					<Input
						placeholder="Tìm kiếm đơn nhập kho..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-[300px]"
					/>
				</Flex>
				<Tabs
					defaultActiveKey={activeKey as string}
					items={items}
					onChange={handleChangeTab}
					centered
				/>
				<List
					grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
					dataSource={
						activeKey === '1' ? ordersFromKiot?.data : ordersInWarehouse
					}
					loading={activeKey === '1' ? isLoadingFromKiot : isLoadingInWarehouse}
					renderItem={(item: any) => {
						return (
							<List.Item>
								<InboundItem
									item={item}
									handleClickDetail={handleClickDetail}
									handleConfirm={handleConfirm}
									handleRemoveHandler={handleRemoveHandler}
									isProcessing={
										activeKey === '1'
											? !item?.status_label ||
											  item?.status_label === FulfillmentStatus.NOT_FULFILLED
											: item.status === FulfillmentStatus.NOT_FULFILLED
									}
									activeKey={activeKey}
								/>
							</List.Item>
						);
					}}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						total: activeKey === '1' ? ordersFromKiot?.total : countInWarehouse,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} đơn nhập`,
					}}
					locale={{
						emptyText:
							activeKey === '1'
								? 'Đã hoàn thành tất cả đơn hàng. Hãy kiểm tra tại tab "Đã hoàn thành"'
								: 'Chưa có đơn hàng nào hoàn thành. Hãy kiểm tra tại tab "Đang thực hiện"',
					}}
				/>
			</Card>
		</Flex>
	);
};

export default ListInbound;
