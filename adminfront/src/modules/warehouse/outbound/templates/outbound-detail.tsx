'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Title, Text } from '@/components/Typography';
import { ArrowLeft, Check, Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import OutboundDetailItem from '../components/outbound-detail-item';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { AdminPostOrdersOrderFulfillmentsReq } from '@medusajs/medusa';
import { useAdminProductOutbound } from '@/lib/hooks/api/product-outbound';
import { FulfillmentStatus } from '@/types/order';
import OutboundModal from '../components/outbound-modal';
import { ActionAbles } from '@/components/Dropdown';
import { Modal as AntdModal, message } from 'antd';
import Image from 'next/image';
import PlaceholderImage from '@/modules/common/components/placeholder-image';
import { useAdminCreateFulfillment } from 'medusa-react';
import { getErrorMessage } from '@/lib/utils';
import { LineItem } from '@/types/lineItem';
import clsx from 'clsx';

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
	const { order, isLoading, refetch } = useAdminProductOutbound(id);
	const createOrderFulfillment = useAdminCreateFulfillment(id);

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
		router.push(ERoutes.WAREHOUSE_OUTBOUND);
	};

	const handleComplete = () => {
		AntdModal.confirm({
			icon: null,
			title: 'Xác nhận hoàn thành lấy hàng',
			content: order?.items.map((item, idx) => {
				return (
					<FulfillmentLine
						item={item as LineItem}
						key={`fulfillmentLine-${idx}`}
					/>
				);
			}),
			onOk: async () => {
				let action: any = createOrderFulfillment;
				let successText = 'Đơn hàng đã được đóng gói thành công.';
				let requestObj;

				requestObj = {
					no_notification: false,
				} as AdminPostOrdersOrderFulfillmentsReq;

				requestObj.items = (order?.items as LineItem[])
					?.filter(
						(item: LineItem) =>
							item?.warehouse_quantity - (item.fulfilled_quantity ?? 0) > 0
					)
					.map((item: LineItem) => ({
						item_id: item.id,
						quantity: item?.warehouse_quantity - (item.fulfilled_quantity ?? 0),
					}));

				await action.mutateAsync(requestObj as any, {
					onSuccess: () => {
						message.success(successText);
						refetch();
					},
					onError: (err: any) => message.error(getErrorMessage(err)),
				});
			},
		});
	};

	const actions = [
		{
			label: 'Hoàn thành lấy hàng',
			icon: <Check size={20} />,
			onClick: () => {
				handleComplete();
			},
			disabled: order?.fulfillment_status === FulfillmentStatus.FULFILLED,
		},
	];

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
				<Flex align="flex-start" justify="space-between">
					<Flex vertical>
						<Title level={4}>{`Đơn hàng #${order?.display_id}`}</Title>
						<Text className="text-gray-600">
							{`Người phụ trách: ${order?.handler?.last_name} ${order?.handler?.first_name}`}
						</Text>
					</Flex>
					<ActionAbles actions={actions as any} />
				</Flex>

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
					locale={{
						emptyText:
							activeKey === FulfillmentStatus.NOT_FULFILLED
								? 'Đã hoàn thành tất cả sản phẩm. Hãy kiểm tra tại tab "Đã hoàn thành"'
								: 'Chưa có sản phẩm nào hoàn thành. Hãy kiểm tra tại tab "Đang thực hiện"',
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

export const getFulfillAbleQuantity = (item: LineItem): number => {
	return item.quantity - (item.fulfilled_quantity ?? 0);
};

const FulfillmentLine = ({ item }: { item: LineItem }) => {
	if (getFulfillAbleQuantity(item) <= 0) {
		return null;
	}

	return (
		<div className="hover:bg-gray-50 rounded-md mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px] cursor-pointer">
			<div className="flex justify-center items-center space-x-4">
				<div className="rounded-sm flex h-[48px] w-[36px] overflow-hidden">
					{item.thumbnail ? (
						<Image
							src={item.thumbnail}
							height={48}
							width={36}
							alt={`Image summary ${item.title}`}
							className="object-cover"
						/>
					) : (
						<PlaceholderImage />
					)}
				</div>
				<div className="flex max-w-[185px] flex-col justify-center text-[12px]">
					<span className="font-normal text-gray-900 truncate">
						{item.title}
					</span>
					{item?.variant && (
						<span className="font-normal text-gray-500 truncate">
							{`${item.variant.title}${
								item.variant.sku ? ` (${item.variant.sku})` : ''
							}`}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-center">
				<span className="flex text-gray-500 text-xs">
					<span
						className={clsx('pl-1', {
							'text-red-500':
								item.warehouse_quantity - (item.fulfilled_quantity ?? 0) >
								getFulfillAbleQuantity(item),
						})}
					>
						{item.warehouse_quantity - (item.fulfilled_quantity ?? 0)}
					</span>
					{'/'}
					<span className="pl-1">{getFulfillAbleQuantity(item)}</span>
				</span>
			</div>
		</div>
	);
};
