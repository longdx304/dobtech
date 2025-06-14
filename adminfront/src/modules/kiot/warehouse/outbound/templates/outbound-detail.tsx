'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import {
	useAdminUpdateProductOutboundKiot,
	useGetOrder,
} from '@/lib/hooks/api/product-outbound';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import PlaceholderImage from '@/modules/admin/common/components/placeholder-image';
import { FulfillmentStatus } from '@/types/fulfillments';
import { LineItem } from '@/types/lineItem';
import { ERoutes } from '@/types/routes';
import { message, TabsProps } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { ArrowLeft, Check, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import ConfirmOrder from '../../components/confirm-order';
import OutboundDetailItem from '../components/outbound-detail-item';
import OutboundModal from '../components/outbound-modal';

type Props = {
	id: string;
};

const DEFAULT_PAGE_SIZE = 10;
const OutboundKiotDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const { user } = useUser();
	const { state, onOpen, onClose } = useToggleState();
	const [searchValue, setSearchValue] = useState<string>('');
	const [variantId, setVariantId] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<LineItem | null>(null);
	const { order, isLoading, refetch } = useGetOrder(id);
	const updateProductOutboundKiot = useAdminUpdateProductOutboundKiot(id);

	const {
		state: confirmState,
		onOpen: onOpenConfirm,
		onClose: onCloseConfirm,
	} = useToggleState(false);

	const isPermission = useMemo(() => {
		if (!user) return false;
		if (user.role === 'admin' || order?.handler_id === user.id) return true;
		return false;
	}, [user, order?.handler_id]);

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

		const itemsByStatus = order.items.filter((item: any) => {
			const lineItem = item as LineItem;
			const warehouse_quantity = lineItem.warehouse_quantity ?? 0;
			if (activeKey === FulfillmentStatus.FULFILLED) {
				return warehouse_quantity === item.quantity;
			}
			return warehouse_quantity !== item.quantity;
		});

		return itemsByStatus
			.filter((item: any) => {
				const lineItem = item as any;
				const title = lineItem.product_name?.toLowerCase();
				const description = lineItem?.product_code?.toLowerCase();
				const search = searchValue.toLowerCase();
				return title.includes(search) || description?.includes(search);
			})
			.sort((a: any, b: any) => {
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
		router.push(ERoutes.KIOT_WAREHOUSE_OUTBOUND);
	};

	const handleComplete = async () => {
		await updateProductOutboundKiot.mutateAsync(
			{
				status: FulfillmentStatus.EXPORTED,
				handled_at: dayjs().format(),
			} as any,
			{
				onSuccess: () => {
					message.success('Đơn hàng đã được xuất kho');
					refetch();

					// onWriteNote();

					onCloseConfirm();
				},
				onError: (err: any) => message.error(getErrorMessage(err)),
			}
		);
	};

	const actions = [
		isPermission && {
			label: 'Hoàn thành xuất kho',
			icon: <Check size={18} />,
			onClick: onOpenConfirm,
			disabled:
				(order?.fulfillment_status as any) === FulfillmentStatus.EXPORTED,
		},
	];

	const handler = order?.handler
		? `${order?.handler?.first_name}`
		: 'Chưa xác định';

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
						<Title level={4}>{`Đơn hàng #${order?.code}`}</Title>
						<Text className="text-gray-600">
							{`Người phụ trách: ${handler}`}
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
					grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
					dataSource={lineItems}
					loading={isLoading}
					renderItem={(item: any) => (
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
						isPermission={isPermission}
						open={state}
						onClose={handleClose}
						lineItem={selectedItem}
					/>
				)}
			</Card>
			{/* <Notes orderId={id} type="OUTBOUND" /> */}
			{confirmState && (
				<ConfirmOrder
					state={confirmState}
					title="Xác nhận hoàn thành xuất kho"
					handleOk={handleComplete}
					handleCancel={onCloseConfirm}
				>
					{/* Danh sách san pham */}
					{order?.items.map((item: any, idx: any) => {
						return (
							<FulfillmentLine
								item={item as LineItem}
								key={`fulfillmentLine-${idx}`}
							/>
						);
					})}
				</ConfirmOrder>
			)}
		</Flex>
	);
};

export default OutboundKiotDetail;

export const getFulfillAbleQuantity = (item: any): number => {
	return item.quantity - (item.warehouse_quantity ?? 0);
};

const FulfillmentLine = ({ item }: { item: any }) => {
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
							alt={`Image summary ${item.product_name}`}
							className="object-cover"
						/>
					) : (
						<PlaceholderImage />
					)}
				</div>
				<div className="flex max-w-[185px] flex-col justify-center text-[12px]">
					<span className="font-normal text-gray-900 truncate">
						{item.product_name}
					</span>
					{item?.product_code && (
						<span className="font-normal text-gray-500 truncate">
							{`${item.product_code}`}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-center">
				<span className="flex text-gray-500 text-xs">
					<span
						className={clsx('pl-1', {
							'text-red-500': item.warehouse_quantity > item.quantity,
						})}
					>
						{item.warehouse_quantity}
					</span>
					{'/'}
					<span className="pl-1">{getFulfillAbleQuantity(item)}</span>
				</span>
			</div>
		</div>
	);
};
