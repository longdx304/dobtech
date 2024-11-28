'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Title, Text } from '@/components/Typography';
import { ArrowLeft, Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import debounce from 'lodash/debounce';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import OutboundDetailItem from '../components/outbound-detail-item';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { LineItem } from '@medusajs/medusa';
import { useAdminProductOutbound } from '@/lib/hooks/api/product-outbound';
import { FulfillmentStatus } from '@/types/order';
import OutboundModal from '../components/outbound-modal';

type Props = {
	id: string;
};

const DEFAULT_PAGE_SIZE = 10;
const OutboundDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState();
	const [searchValue, setSearchValue] = useState<string>('');
	const [variantId, setVariantId] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<LineItem | null>(null);
	const { order, isLoading } = useAdminProductOutbound(id);

	const [activeKey, setActiveKey] = useState<FulfillmentStatus>(
		FulfillmentStatus.NOT_FULFILLED
	);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangeTab = (key: string) => {
		setActiveKey(key as FulfillmentStatus);
	};

	const lineItems = useMemo(() => {
		if (!order?.items) return [];

		const itemsByStatus = order.items.filter((item: LineItem) => {
			const fulfilled_quantity = item.fulfilled_quantity ?? 0;
			if (activeKey === FulfillmentStatus.FULFILLED) {
				return fulfilled_quantity === item.quantity;
			}
			return fulfilled_quantity !== item.quantity;
		});

		return itemsByStatus
			.filter((item: LineItem) => {
				const title = item.title.toLowerCase();
				const description = item?.description?.toLowerCase();
				const search = searchValue.toLowerCase();
				return title.includes(search) || description?.includes(search);
			})
			.sort((a, b) => {
				return (
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);
			});
	}, [order?.items, searchValue, activeKey]);

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

	const handleClickDetail = (id: string | null, item: LineItem) => {
		setVariantId(id);
		setSelectedItem(item);
		onOpen();
	};

	const handleClose = () => {
		setVariantId(null);
		onClose();
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
			</Flex>
			<Card loading={false} className="w-full mb-10" bordered={false}>
				<Title level={4}>{`Đơn nhập hàng #${order?.display_id}`}</Title>
				<Text className="text-gray-600">
					{`Người phụ trách: ${order?.handler?.last_name} ${order?.handler?.first_name}`}
				</Text>
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
					dataSource={lineItems}
					loading={isLoading}
					renderItem={(item: LineItem) => (
						<List.Item>
							<OutboundDetailItem
								item={item}
								handleClickDetail={(id) => handleClickDetail(id, item)}
							/>
						</List.Item>
					)}
					pagination={{
						pageSize: DEFAULT_PAGE_SIZE,
						total: lineItems.length,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} biến thể`,
					}}
				/>
				{state && variantId && selectedItem && (
					<OutboundModal
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

export default OutboundDetail;
