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

type Props = {
	id: string;
};

const data = [
	{
		id: 'so_01JCMNRC7GZWXVKRZDE3C64T05',
		created_at: '2024-11-14T06:28:43.874Z',
		updated_at: '2024-11-14T06:28:43.874Z',
		display_id: 1,
		supplier_id: 'supplier_01JCMNQHEMC9M93NT2NPBJ8GT6',
		user_id: 'usr_01JBB4EAXMYP7PCYJAKD8T4XQB',
		cart_id: 'cart_01JCMNR8NR3B7XC446PTBG6C96',
		status: 'pending',
		fulfillment_status: 'delivered',
		payment_status: 'awaiting',
		estimated_production_time: '2024-11-21T06:28:40.879Z',
		settlement_time: '2024-11-21T06:28:40.878Z',
		canceled_at: null,
		region_id: 'reg_01JBB4ED399MGK8RKHF09PYHE8',
		currency_code: 'vnd',
		tax_rate: 0,
		metadata: {},
		no_notification: false,
		subtotal: 30000,
		refunded_total: 0,
		paid_total: 33000,
		refundable_amount: 33000,
		tax_total: 0,
		total: 30000,
	},
];

const DEFAULT_PAGE_SIZE = 10;
const InboundDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');

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

	const handleClickDetail = (id: string) => {
		console.log('id', id);
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
			<Card loading={false} className="w-full" bordered={false}>
				<Title level={4}>{`Đơn nhập hàng #${1}`}</Title>
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
					dataSource={data}
					renderItem={(item: SupplierOrder) => (
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
			</Card>
		</Flex>
	);
};

export default InboundDetail;
