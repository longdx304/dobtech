'use client';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import DatePicker from '@/components/Input/DatePicker';
import List from '@/components/List';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import {
	useAdminAssignShipment,
	useAdminFulfillments,
} from '@/lib/hooks/api/fulfullment';
import { Fulfillment, FulfullmentStatus } from '@/types/fulfillments';
import { ERoutes } from '@/types/routes';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import ShipmentItem from '../components/shipment-item';
import { Alert, message, Modal as AntdModal, Switch } from 'antd';
import { getErrorMessage } from '@/lib/utils';
import DeliveryAssistantModal from '../components/delivery-assistant-modal';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const ListShipment: FC<Props> = ({}) => {
	const router = useRouter();

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [activeKey, setActiveKey] = useState<FulfullmentStatus>(
		FulfullmentStatus.AWAITING
	);
	const [myOrder, setMyOrder] = useState(false);
	const [createdFrom, setCreatedFrom] = useState<Dayjs | null>(null);
	const [pendingFulfillment, setPendingFulfillment] =
		useState<Fulfillment | null>(null);

	const { fulfillments, isLoading, isError, refetch, count } =
		useAdminFulfillments({
			q: searchValue || undefined,
			offset,
			limit: DEFAULT_PAGE_SIZE,
			expand:
				'order,order.customer,order.shipping_address,shipper,delivery_assistant,checker',
			status: activeKey,
			isMyOrder: myOrder ? true : undefined,
			created_at: createdFrom
				? { gte: createdFrom.startOf('day').toDate() }
				: undefined,
		});
	const fulfillmentList = Array.isArray(fulfillments)
		? fulfillments.filter(Boolean)
		: [];

	const updateFulfillment = useAdminAssignShipment();

	const handleChangeDebounce = useMemo(
		() =>
			debounce((inputValue: string) => {
				setSearchValue(inputValue.trim());
				setNumPages(1);
				setOffset(0);
			}, 500),
		[]
	);

	useEffect(() => () => handleChangeDebounce.cancel(), [handleChangeDebounce]);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const handleClickDetail = async (item: Fulfillment) => {
		return router.push(`${ERoutes.WAREHOUSE_SHIPMENT}/${item.id}`);
	};

	const items: any = [
		{
			key: FulfullmentStatus.AWAITING,
			label: 'Chờ giao',
		},
		{
			key: FulfullmentStatus.DELIVERING,
			label: 'Đang giao',
		},
		{
			key: FulfullmentStatus.SHIPPED,
			label: 'Đã giao',
		},
		{
			key: FulfullmentStatus.CANCELED,
			label: 'Đã hủy',
		},
	];

	const handleChangeTab = (key: FulfullmentStatus) => {
		setActiveKey(key);
		setNumPages(1);
		setOffset(0);
	};

	const handleMyOrderChange = (checked: boolean) => {
		setMyOrder(checked);
		setNumPages(1);
		setOffset(0);
	};

	const handleCreatedFromChange = (date: Dayjs | null) => {
		setCreatedFrom(date);
		setNumPages(1);
		setOffset(0);
	};

	const handleConfirm = async (item: Fulfillment) => {
		setPendingFulfillment(item);
	};

	const handleConfirmDeliveryAssistant = async (
		deliveryAssistantId: string | null
	) => {
		if (!pendingFulfillment) return;
		try {
			await updateFulfillment.mutateAsync({
				fulfillment_id: pendingFulfillment.id,
				status: FulfullmentStatus.DELIVERING,
				delivery_assistant_id: deliveryAssistantId,
			});
			message.success('Đã thêm vào danh sách giao hàng');
			setPendingFulfillment(null);
		} catch (error) {
			message.error(getErrorMessage(error));
			throw error;
		}
	};

	const handleRemoveHandler = (item: Fulfillment) => {
		AntdModal.confirm({
			title: 'Đưa đơn về Chờ giao?',
			content:
				'Thao tác này sẽ xóa người phụ trách giao và người phụ xe hiện tại.',
			okText: 'Đưa về Chờ giao',
			cancelText: 'Hủy',
			okButtonProps: { danger: true },
			onOk: async () => {
				try {
					await updateFulfillment.mutateAsync({
						fulfillment_id: item.id,
						status: FulfullmentStatus.AWAITING,
					});
					message.success('Đã đưa đơn về Chờ giao');
				} catch (error) {
					message.error(getErrorMessage(error));
					throw error;
				}
			},
		});
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Danh sách đơn hàng</Title>
				<Text className="text-gray-600">
					Trang danh sách các đơn cần vận chuyển.
				</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Title level={4}>Theo dõi các đơn hàng</Title>
				<Flex
					align="center"
					justify="space-between"
					className="flex-col gap-3 py-4 sm:flex-row"
				>
					<Flex align="center" gap={8}>
						<Text className="text-gray-700 font-medium">Đơn hàng của tôi</Text>
						<Switch
							checked={myOrder}
							onChange={handleMyOrderChange}
						/>
					</Flex>
					<Flex
						align="center"
						gap={8}
						className="w-full flex-col sm:w-auto sm:flex-row"
					>
						<DatePicker
							value={createdFrom}
							onChange={handleCreatedFromChange}
							disabledDate={(date) => date.isAfter(dayjs(), 'day')}
							placeholder="Từ ngày tạo"
							className="w-full sm:w-[180px]"
						/>
						<Input
							placeholder="Tìm kiếm đơn hàng..."
							name="search"
							prefix={<Search size={16} />}
							onChange={(event) =>
								handleChangeDebounce(event.target.value)
							}
							className="w-full sm:w-[300px]"
						/>
					</Flex>
				</Flex>
				<Tabs
					defaultActiveKey={activeKey as any}
					items={items}
					onChange={handleChangeTab as any}
					centered
				/>
				{isError ? (
					<Alert
						type="error"
						showIcon
						message="Không thể tải danh sách giao hàng"
						description="Vui lòng kiểm tra kết nối và thử tải lại dữ liệu."
						action={
							<Button type="default" onClick={() => refetch()}>
								Thử lại
							</Button>
						}
					/>
				) : (
					<List
						grid={{
							gutter: 12,
							xs: 1,
							sm: 2,
							md: 2,
							lg: 3,
							xl: 4,
							xxl: 5,
						}}
						dataSource={fulfillmentList}
						loading={isLoading}
						renderItem={(item: Fulfillment) => (
							<List.Item>
								<ShipmentItem
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
							total: count,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} trong ${total} đơn hàng`,
						}}
					/>
				)}
			</Card>
			{pendingFulfillment && (
				<DeliveryAssistantModal
					open
					fulfillment={pendingFulfillment}
					onClose={() => setPendingFulfillment(null)}
					onConfirm={handleConfirmDeliveryAssistant}
					isLoading={updateFulfillment.isLoading}
				/>
			)}
		</Flex>
	);
};

export default ListShipment;
