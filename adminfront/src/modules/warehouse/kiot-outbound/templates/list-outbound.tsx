'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import {
	useAssignOrder,
	useGetStockOut,
	useListOrdersKiot,
	useUnassignOrder,
} from '@/lib/hooks/api/product-outbound';
import { getErrorMessage } from '@/lib/utils';
import { FulfillmentStatus } from '@/types/fulfillments';
import { KiotOrderStatus } from '@/types/kiot';
import { ERoutes } from '@/types/routes';
import { Order } from '@medusajs/medusa';
import { message, Select } from 'antd';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
import OutboundItem from '../components/outbound-item';

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
const ListOutboundKiot: FC<Props> = ({}) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [sortOrder, setSortOrder] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<string>('1');

	const { orders: ordersFromKiot, isLoading: isLoadingFromKiot, count: countFromKiot } = useGetStockOut({
		offset,
		limit: DEFAULT_PAGE_SIZE,
		status: [KiotOrderStatus.COMPLETED],
		...SORT_ORDER[sortOrder as keyof typeof SORT_ORDER],
	});

	const { orders: ordersInWarehouse, isLoading: isLoadingInWarehouse, count: countInWarehouse } =
		useListOrdersKiot({
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
		console.log('key', key);
		setActiveKey(key);
		setOffset(0);
		setNumPages(1);
	};

	const items: any = [
		{
			key: '1',
			label: 'Đơn hàng trên KiotViet',
		},
		{
			key: '2',
			label: 'Đơn hàng trong kho',
		},
	];

	const handleClickDetail = async (item: any) => {
		return router.push(`${ERoutes.WAREHOUSE_OUTBOUND_KIOT}/${item.id}`);
	};

	const handleConfirm = async (item: Order) => {
		await assignOrder.mutateAsync(
			{ id: item.id },
			{
				onSuccess: () => {
					message.success('Giao hàng thành công');
				},
				onError: (err: any) => {
					message.error(getErrorMessage(err));
				},
			}
		);
	};

	const handleRemoveHandler = async (item: any) => {
		await unassignOrder.mutateAsync(
			{ id: item.id },
			{
				onSuccess: () => {
					message.success('Huỷ bỏ xử lý đơn hàng thành công');
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
				<Title level={3}>Đơn hàng</Title>
				<Text className="text-gray-600">Trang danh sách các đơn xuất kho.</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Flex justify="flex-start" align="center" gap={12}>
					<Title level={4}>Theo dõi các đơn hàng kho Chamdep</Title>
					<Link href={ERoutes.WAREHOUSE_OUTBOUND} className="">
						Chuyển kho Chamdep
					</Link>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					className="py-4 lg:flex-row flex-col"
				>
					<Flex align="center" gap={8} className="py-2">
						<Select
							defaultValue={sortOrder}
							onChange={(value) => setSortOrder(value as any)}
							options={[
								{
									label: 'Ngày mới nhất',
									value: 1,
								},
								{
									label: 'Ngày cũ nhất',
									value: 2,
								},
								{
									label: 'Mã mới nhất',
									value: 3,
								},
								{
									label: 'Mã cũ nhất',
									value: 4,
								},
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
					grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
					dataSource={activeKey === '1' ? ordersFromKiot?.data : ordersInWarehouse}
					loading={activeKey === '1' ? isLoadingFromKiot : isLoadingInWarehouse}
					renderItem={(item: any) => (
						<List.Item>
							<OutboundItem
								item={item}
								handleClickDetail={handleClickDetail}
								handleConfirm={handleConfirm}
								handleRemoveHandler={handleRemoveHandler}
								isProcessing={activeKey === '1'}
							/>
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						total: activeKey === '1' ? ordersFromKiot?.total : countInWarehouse,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} đơn hàng`,
					}}
					locale={{
						emptyText:
							activeKey === '1'
								? 'Không có đơn hàng nào đang thực hiện.'
								: 'Không có đơn hàng nào đã hoàn thành.',
					}}
				/>
			</Card>
		</Flex>
	);
};

export default ListOutboundKiot;
