'use client';
import { splitFiles } from '@/actions/images';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import UploadTemplate from '@/components/Upload/UploadTemplate';
import {
	useAdminFulfillment,
	useAdminUpdateFulfillment,
} from '@/lib/hooks/api/fulfullment';
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';
import { getErrorMessage } from '@/lib/utils';
import { FormImage } from '@/types/common';
import { Fulfillment, FulfullmentStatus } from '@/types/fulfillments';
import { ERoutes } from '@/types/routes';
import { Divider, message } from 'antd';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import {
	ArrowLeft,
	Check,
	Clock,
	Hash,
	MapPin,
	Pencil,
	Search,
	UserRound,
	UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import fulfillmentColumns from './columns';
import DeliveryAssignmentModal from '../components/delivery-assignment-modal';
import {
	canEditDeliveryAssignment,
	getDeliveryStaffName,
} from '../utils/delivery-assignment';

type ShipmentDetailProps = {
	id: string;
};

const ShipmentDetail = ({ id }: ShipmentDetailProps) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [files, setFiles] = useState<FormImage[]>([]);
	const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

	const { fulfillment, isLoading, isError, refetch } = useAdminFulfillment(id);
	const updateFulfillment = useAdminUpdateFulfillment(id);
	const uploadFile = useAdminUploadFile();

	const isProcessing = fulfillment?.status === FulfullmentStatus.DELIVERING;

	useEffect(() => {
		if (!isProcessing && fulfillment?.shipped_url?.length) {
			setFiles(
				fulfillment.shipped_url
					.split(',')
					.map((url, index) => ({
						id: url,
						url,
						name: `Ảnh giao hàng #${index + 1}`,
					}))
			);
		}
	}, [fulfillment?.shipped_url, isProcessing]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const itemTable = useMemo(() => {
		if (!fulfillment) return [];
		const items = Array.isArray(fulfillment.items) ? fulfillment.items : [];
		const search = searchValue.toLowerCase();
		return items.filter(({ item }: any) =>
			(item?.title || '').toLowerCase().includes(search)
		);
	}, [fulfillment, searchValue]);

	const handleBackToList = () => {
		router.push(ERoutes.WAREHOUSE_SHIPMENT);
	};

	const handleUpdateAssignment = async (
		shipperId: string,
		deliveryAssistantId: string | null
	) => {
		try {
			await updateFulfillment.mutateAsync({
				shipped_id: shipperId,
				delivery_assistant_id: deliveryAssistantId,
			});
			message.success('Cập nhật người giao hàng thành công');
			setIsAssignmentModalOpen(false);
		} catch (error) {
			message.error(getErrorMessage(error));
			throw error;
		}
	};

	const onConfirm = async () => {
		if (files.length === 0) {
			message.warning('Vui lòng tải lên hình ảnh sản phẩm');
			return;
		}

		const { uploadImages } = splitFiles(files);
		// Split images into chunks of maximum 3 images each
		const CHUNK_SIZE = 10;
		const chunks: File[][] = [];

		for (let i = 0; i < uploadImages.length; i += CHUNK_SIZE) {
			chunks.push(uploadImages.slice(i, i + CHUNK_SIZE));
		}

		// Create an array of upload promises
		const uploadPromises = chunks.map(async (chunk) => {
			try {
				const { uploads } = await uploadFile.mutateAsync({
					files: chunk,
					prefix: 'warehouse/shipment',
				});
				return uploads.map((item) => item.url);
			} catch (error) {
				console.error('Error uploading chunk:', error);
				throw error;
			}
		});

		// Show loading message
		const loadingMessage = message.loading('Đang tải lên hình ảnh...', 0);

		try {
			// Wait for all chunks to be uploaded
			const results = await Promise.all(uploadPromises);

			// Flatten the array of URLs
			const allUrls = results.flat();

			// Update fulfillment with all URLs
			await updateFulfillment.mutateAsync(
				{
					shipped_url: allUrls.join(','),
					status: FulfullmentStatus.SHIPPED,
				},
				{
					onSuccess: () => {
						message.success('Giao hàng thành công');
					},
					onError: (error) => {
						message.error(getErrorMessage(error));
					},
				}
			);
		} catch (error) {
			message.error('Có lỗi xảy ra khi tải lên hình ảnh');
			console.error('Upload error:', error);
		} finally {
			// Close loading message
			loadingMessage();
		}
		return;
	};

	if (isLoading) {
		return <Card loading className="min-h-[320px] w-full" rounded />;
	}

	if (isError || !fulfillment) {
		return (
			<Card className="w-full" rounded>
				<Flex
					vertical
					align="center"
					justify="center"
					gap={12}
					className="min-h-[280px] text-center"
				>
					<Text className="text-base font-semibold">
						Không thể tải chi tiết đơn giao hàng
					</Text>
					<Text className="max-w-md text-sm text-gray-500">
						Vui lòng kiểm tra kết nối và thử tải lại dữ liệu.
					</Text>
					<Button type="primary" onClick={() => refetch()}>
						Thử lại
					</Button>
				</Flex>
			</Card>
		);
	}

	const buttonText = () => {
		switch (fulfillment.status) {
			case FulfullmentStatus.AWAITING:
				return 'Chờ xác nhận';
			case FulfullmentStatus.DELIVERING:
				return 'Xác nhận giao hàng';
			case FulfullmentStatus.SHIPPED:
				return 'Đã giao';
			case FulfullmentStatus.CANCELED:
				return 'Đã hủy';
			default:
				return 'N/A';
		}
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
			<Card loading={isLoading} className="w-full mb-10" rounded>
				<OrderInfo
					fulfillment={fulfillment}
					isProcessing={isProcessing}
					onEditAssignment={() => setIsAssignmentModalOpen(true)}
				/>
				<Flex
					vertical
					align="flex-end"
					justify="flex-end"
					className="py-4"
					gap={4}
				>
					<Input
						placeholder="Tìm kiếm sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-full sm:w-[300px]"
					/>
					<Table
						columns={fulfillmentColumns as any}
						dataSource={itemTable}
						rowKey="item_id"
						showHeader={false}
					/>
					<Divider />
					<UploadTemplate
						files={files}
						setFiles={setFiles}
						hiddenUpload={!isProcessing}
					/>

					<Button
						disabled={!isProcessing}
						loading={updateFulfillment.isLoading || uploadFile.isLoading}
						onClick={onConfirm}
						type="primary"
						className="w-full sm:w-[200px]"
					>
						{buttonText()}
					</Button>
				</Flex>
			</Card>
			<DeliveryAssignmentModal
				open={isAssignmentModalOpen}
				fulfillment={fulfillment}
				onClose={() => setIsAssignmentModalOpen(false)}
				onConfirm={handleUpdateAssignment}
				isLoading={updateFulfillment.isLoading}
			/>
		</Flex>
	);
};

export default ShipmentDetail;

const OrderInfo = ({
	fulfillment,
	isProcessing = false,
	onEditAssignment,
}: {
	fulfillment: Fulfillment;
	isProcessing: boolean;
	onEditAssignment: () => void;
}) => {
	const order = fulfillment.order;
	const customer = order?.customer;
	const statusText = () => {
		switch (fulfillment.status) {
			case FulfullmentStatus.AWAITING:
				return 'Chờ xác nhận';
			case FulfullmentStatus.DELIVERING:
				return 'Đang giao';
			case FulfullmentStatus.SHIPPED:
				return 'Đã giao';
			case FulfullmentStatus.CANCELED:
				return 'Đã hủy';
			default:
				return 'N/A';
		}
	};
	const color = () => {
		switch (fulfillment.status) {
			case FulfullmentStatus.AWAITING:
				return 'gray';
			case FulfullmentStatus.DELIVERING:
				return 'gold';
			case FulfullmentStatus.SHIPPED:
				return 'green';
			case FulfullmentStatus.CANCELED:
				return 'red';
			default:
				return 'gray';
		}
	};

	const shipper = getDeliveryStaffName(
		fulfillment.shipper,
		'Chưa có người giao hàng'
	);
	const deliveryAssistant = getDeliveryStaffName(
		fulfillment.delivery_assistant,
		'Không có người phụ xe'
	);

	const address = order?.shipping_address
		? [
				order.shipping_address.address_2,
				order.shipping_address.city,
				order.shipping_address.address_1,
				order.shipping_address.province,
				order.shipping_address.country_code,
		  ]
				.filter(Boolean)
				.join(' ')
		: 'Chưa có địa chỉ giao hàng';

	return (
		<div>
			<Tag
				color={color()}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">{statusText()}</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex vertical gap={4} className="mt-2">
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Hash size={14} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{`#${order?.display_id ?? '-'} - ${[
							customer?.last_name,
							customer?.first_name,
						]
							.filter(Boolean)
							.join(' ') || 'Khách hàng không xác định'} - ${
							customer?.phone || 'Không có SĐT'
						}`}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<MapPin color="#6b7280" width={18} height={18} />
					</div>
					<Text className="text-sm font-semibold">{address}</Text>
				</Flex>
			</Flex>
			<Flex
				align="flex-start"
				justify="space-between"
				className="mt-4 flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row"
			>
				<Flex vertical gap={10} className="min-w-0">
					<Text className="text-sm font-semibold text-gray-700">
						Phân công giao hàng
					</Text>
					<Flex gap={8} align="center">
						<UserRound className="shrink-0 text-gray-500" size={18} />
						<div className="min-w-0">
							<Text className="block text-xs text-gray-500">
								Người phụ trách giao
							</Text>
							<Text
								className={clsx('block truncate text-sm font-semibold', {
									'text-red-500': !fulfillment.shipped_id,
									'text-green-600': fulfillment.shipped_id,
								})}
							>
								{shipper}
							</Text>
						</div>
					</Flex>
					<Flex gap={8} align="center">
						<UsersRound className="shrink-0 text-gray-500" size={18} />
						<div className="min-w-0">
							<Text className="block text-xs text-gray-500">Người phụ xe</Text>
							{fulfillment.delivery_assistant_id ? (
								<Text className="block truncate text-sm font-semibold">
									{deliveryAssistant}
								</Text>
							) : (
								<Tag color="default" className="mt-1 w-fit">
									Không có phụ xe
								</Tag>
							)}
						</div>
					</Flex>
				</Flex>
				{canEditDeliveryAssignment(fulfillment.status) && (
					<Button
						type="default"
						icon={<Pencil size={16} />}
						onClick={onEditAssignment}
						className="w-full sm:w-auto"
					>
						Chỉnh sửa phân công
					</Button>
				)}
			</Flex>
		</div>
	);
};
