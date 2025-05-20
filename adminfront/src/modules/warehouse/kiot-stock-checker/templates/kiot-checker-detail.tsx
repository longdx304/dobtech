'use client';
import { splitFiles } from '@/actions/images';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Input, TextArea } from '@/components/Input';
import { Table } from '@/components/Table';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import UploadTemplate from '@/components/Upload/UploadTemplate';
import {
	useAdminOrderKiotCheck,
	useAdminProductOutbound,
	useAdminProductOutboundCheck,
	useAdminUpdateProductOutbound,
	useGetOrder,
	useUpdateOrderKiot,
} from '@/lib/hooks/api/product-outbound';
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import PlaceholderImage from '@/modules/common/components/placeholder-image';
import { FormImage } from '@/types/common';
import { FulfillmentStatus } from '@/types/fulfillments';
import { LineItem } from '@/types/lineItem';
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { AdminPostOrdersOrderFulfillmentsReq } from '@medusajs/medusa';
import { Divider, message } from 'antd';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import debounce from 'lodash/debounce';
import {
	ArrowLeft,
	Check,
	Clock,
	Hash,
	MapPin,
	Search,
	User,
	UserCheck,
} from 'lucide-react';
import { useAdminCreateFulfillment } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import ConfirmOrder from '../../components/confirm-order';
import fulfillmentColumns from './columns';

type KiotCheckerDetailProps = {
	id: string;
};

const KiotCheckerDetail = ({ id }: KiotCheckerDetailProps) => {
	const router = useRouter();
	const { user } = useUser();

	const [searchValue, setSearchValue] = useState<string>('');
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [prevSelectedKeys, setPrevSelectedKeys] = useState<string[]>([]);
	const [files, setFiles] = useState<FormImage[]>([]);

	const {
		state: confirmState,
		onOpen: onOpenConfirm,
		onClose: onCloseConfirm,
	} = useToggleState(false);
	const [noteInput, setNoteInput] = useState<string>('');

	// const createOrderFulfillment = useAdminCreateFulfillment(id);
	const updateOrderKiot = useUpdateOrderKiot();

	const {
		order: orderKiot,
		isLoading: isLoadingOrderKiot,
		refetch: refetchOrderKiot,
	} = useGetOrder(id);

	const checkFulfillment = useAdminOrderKiotCheck();
	const uploadFile = useAdminUploadFile();

	const isProcessing = orderKiot?.status !== FulfillmentStatus.FULFILLED;

	const isPermission = useMemo(() => {
		if (!user) return false;
		if (user.role === 'admin' || orderKiot?.checker_id === user.id) return true;
		return false;
	}, [user, orderKiot?.checker_id]);

	const handleRowSelectionChange = (selectedRowKeys: string[]) => {
		// Find newly selected and unselected items by comparing with previous state
		const newlySelected = selectedRowKeys.filter(
			(key) => !prevSelectedKeys.includes(key)
		);
		const newlyUnselected = prevSelectedKeys.filter(
			(key) => !selectedRowKeys.includes(key)
		);

		// Update states
		setSelectedRowKeys(selectedRowKeys);
		setPrevSelectedKeys(selectedRowKeys);

		// Handle newly selected items
		if (newlySelected.length > 0) {
			handleCheckFulfillment(newlySelected);
		}

		// Handle newly unselected items
		if (newlyUnselected.length > 0) {
			handleUncheckFulfillment(newlyUnselected);
		}
	};

	const handleCheckFulfillment = async (itemIds: string[]) => {
		await checkFulfillment.mutateAsync({
			id: Number(id),
			itemId: itemIds,
			checked: true,
		});
		refetchOrderKiot();
	};

	const handleUncheckFulfillment = async (itemIds: string[]) => {
		await checkFulfillment.mutateAsync({
			id: Number(id),
			itemId: itemIds,
			checked: false,
		});
		refetchOrderKiot();
	};

	const updateCheckboxesFromMetadata = () => {
		if (isProcessing && orderKiot) {
			// Select items that have metadata with is_outbound=true
			const checkedItems = orderKiot.items
				.filter((item: any) => item.metadata?.is_outbound === true)
				.map((item: any) => item.id);

			if (checkedItems.length > 0) {
				setSelectedRowKeys(checkedItems);
			}
		}
	};

	useEffect(() => {
		if (!isProcessing && orderKiot) {
			// Map item IDs for selection
			const items = orderKiot.items.map((item: any) => item.id);
			setSelectedRowKeys(items);

			// Handle checker_url if it exists
			if (orderKiot?.checker_url?.length) {
				setFiles(
					orderKiot.checker_url.split(',').map((url: any, index: any) => ({
						id: url,
						url,
						name: `Ảnh #${index + 1}`,
					}))
				);
			}
		}

		updateCheckboxesFromMetadata();
		//eslint-disable-next-line
	}, [orderKiot?.checker_url, orderKiot]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const itemTable = useMemo(() => {
		if (!orderKiot) return [];
		const items = orderKiot?.items?.filter((item: any) =>
			item?.product_name?.toLowerCase()?.includes(searchValue.toLowerCase())
		);

		return items;
	}, [orderKiot, searchValue]);

	const handleBackToList = () => {
		router.push(ERoutes.WAREHOUSE_STOCK_CHECKER_KIOT);
	};

	const onConfirm = async () => {
		if (selectedRowKeys?.length !== itemTable?.length) {
			message.warning('Vui lòng kiểm hết sản phẩm trước khi xác nhận');
			return;
		}
		if (files.length === 0) {
			message.warning('Vui lòng tải lên hình ảnh sản phẩm');
			return;
		}
		if (
			(orderKiot?.status as FulfillmentStatus) !== FulfillmentStatus.EXPORTED
		) {
			message.warning('Đơn hàng chưa được xác nhận xuất kho');
			return;
		}

		onOpenConfirm();
		return;
	};

	if (!orderKiot) return null;

	// Function upload images
	const handleUploadFile = async () => {
		const { uploadImages } = splitFiles(files);

		// Split images into chunks of maximum 5 images each
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
					prefix: 'warehouse/kiot-stock-checker',
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
			return allUrls.join(',');
		} catch (error) {
			return null;
		} finally {
			// Close loading message
			loadingMessage();
		}
	};

	// Function update checker_url & checker_at
	const handleCompleteChecker = (id: string, filesUrl: string) => {
		updateOrderKiot.mutate(
			{
				id,
				data: {
					checker_url: filesUrl,
					checker_at: new Date().toISOString(),
				},
			},
			{
				onSuccess: () => {
					refetchOrderKiot();
				},
				onError: (err: any) => message.error(getErrorMessage(err)),
			}
		);
	};
	const handleComplete = async () => {
		// let action: any = createOrderFulfillment;
		let successText = 'Đơn hàng đã được kiêm hàng thành công.';
		let requestObj;

		requestObj = {
			no_notification: false,
		} as AdminPostOrdersOrderFulfillmentsReq;

		requestObj.items = (orderKiot?.items as LineItem[])
			?.filter(
				(item: LineItem) =>
					item?.warehouse_quantity - (item.fulfilled_quantity ?? 0) > 0
			)
			.map((item: LineItem) => ({
				item_id: item.id,
				quantity: item?.warehouse_quantity - (item.fulfilled_quantity ?? 0),
			}));

		const isUnsufficientQuantity = (orderKiot?.items as LineItem[]).some(
			(item) => item.warehouse_quantity < item.quantity
		);

		if (isUnsufficientQuantity && isEmpty(noteInput)) {
			message.error(
				'Số lượng xuất kho không đúng với số lượng giao của đơn hàng. Vui lòng thêm ghi chú nếu muốn hoàn thành đơn'
			);
			return;
		}

		// Check upload file before create fulfillment
		const filesUrl = await handleUploadFile();
		if (!filesUrl) {
			message.error('Có lỗi xảy ra khi tải ảnh lên');
			return;
		}

		await updateOrderKiot.mutateAsync(
			{
				id,
				data: {
					status: FulfillmentStatus.FULFILLED,
					checker_url: filesUrl,
					checker_at: new Date().toISOString(),
				},
			},
			{
				onSuccess: () => {
					message.success(successText);
					refetchOrderKiot();

					handleCompleteChecker(id, filesUrl);

					onCloseConfirm();
				},
				onError: (err: any) => message.error(getErrorMessage(err)),
			}
		);
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;

		setNoteInput(inputValue);
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
			<Card loading={isLoadingOrderKiot} className="w-full mb-10" rounded>
				<OrderInfo order={orderKiot!} isProcessing={isProcessing} />
				<Flex
					vertical
					align="flex-end"
					justify="flex-end"
					className="py-4"
					gap={4}
				>
					<Flex
						gap={4}
						align="center"
						justify="space-between"
						className="w-full"
					>
						<Button
							onClick={() => {
								refetchOrderKiot().then(() => {
									updateCheckboxesFromMetadata();
								});
							}}
							icon={<Clock size={16} />}
							className="text-sm flex items-center"
						>
							Làm mới
						</Button>

						<Input
							placeholder="Tìm kiếm sản phẩm..."
							name="search"
							prefix={<Search size={16} />}
							onChange={handleChangeDebounce}
							className="w-full sm:w-[300px]"
						/>
					</Flex>

					<Text className="text-gray-500 text-xs">{`Đã kiểm ${
						selectedRowKeys?.length ?? 0
					} trong ${itemTable?.length}`}</Text>
					<Table
						columns={fulfillmentColumns as any}
						dataSource={itemTable}
						rowKey="id"
						showHeader={false}
						rowSelection={{
							type: 'checkbox',
							selectedRowKeys: selectedRowKeys,
							onChange: handleRowSelectionChange as any,
							preserveSelectedRowKeys: true,
							getCheckboxProps: (record: any) => ({
								disabled:
									!isProcessing ||
									record?.warehouse_quantity !== record.quantity ||
									!isPermission,
							}),
						}}
					/>
					<Divider />
					{isPermission && (
						<UploadTemplate
							files={files}
							setFiles={setFiles}
							hiddenUpload={!isProcessing}
						/>
					)}

					<Button
						disabled={!isProcessing || !isPermission}
						onClick={onConfirm}
						loading={
							// createOrderFulfillment.isLoading ||
							uploadFile.isLoading || updateOrderKiot.isLoading
						}
						type="primary"
						className="w-full sm:w-[200px]"
					>
						{isProcessing ? 'Kiểm hàng' : 'Đã kiểm hàng'}
					</Button>
				</Flex>
			</Card>
			{confirmState && (
				<ConfirmOrder
					state={confirmState}
					title="Xác nhận hoàn kiểm hàng xuất kho"
					handleOk={handleComplete}
					handleCancel={onCloseConfirm}
					isLoading={uploadFile.isLoading || updateOrderKiot.isLoading}
				>
					{/* Danh sách san pham */}
					{orderKiot?.items.map((item: any, idx: any) => {
						return (
							<FulfillmentLine
								item={item as LineItem}
								key={`fulfillmentLine-${idx}`}
							/>
						);
					})}

					{/* Ghi chú */}
					<TextArea
						value={noteInput}
						onChange={onChangeInput}
						placeholder="Nhập ghi chú"
						className="w-full"
					/>
				</ConfirmOrder>
			)}
		</Flex>
	);
};

export default KiotCheckerDetail;

const OrderInfo = ({
	order,
	isProcessing = false,
}: {
	order: any;
	isProcessing: boolean;
}) => {
	const checker = order?.checker
		? `${order?.checker?.first_name}`
		: 'Chưa xác định';

	return (
		<div>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg mb-2"
			>
				<span className="text-[14px] font-semibold">
					{isProcessing ? 'Chờ kiểm hàng' : 'Đã kiểm hàng'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex vertical gap={4} className="mt-2">
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<Hash size={14} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{`Mã đơn hàng: ${order?.code || ''}`}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<User size={14} color="#6b7280" />
					</div>
					<Text className="text-sm font-semibold">
						{`Khách hàng: ${order?.customer_name || ''}`}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<UserCheck color="#6b7280" width={18} height={18} />
					</div>
					<Text className="text-sm font-semibold">
						{`Người kiểm hàng: ${checker}`}
					</Text>
				</Flex>
			</Flex>
		</div>
	);
};

export const getFulfillAbleQuantity = (item: any): number => {
	return item.warehouse_quantity - (item.quantity ?? 0);
};

const FulfillmentLine = ({ item }: { item: any }) => {
	if (getFulfillAbleQuantity(item) <= 0) {
		return null;
	}

	return (
		<div className="hover:bg-gray-50 rounded-md mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px] cursor-pointer">
			<div className="flex justify-center items-center space-x-4">
				<div className="flex max-w-[185px] flex-col justify-center text-[12px]">
					<span className="font-normal text-gray-900 truncate">
						{item.product_name}
					</span>
				</div>
			</div>
			<div className="flex items-center">
				<span className="flex text-gray-500 text-xs">
					<span
						className={clsx('pl-1', {
							'text-red-500':
								item.warehouse_quantity - (item.quantity ?? 0) >
								getFulfillAbleQuantity(item),
						})}
					>
						{item.warehouse_quantity - (item.quantity ?? 0)}
					</span>
					{'/'}
					<span className="pl-1">{getFulfillAbleQuantity(item)}</span>
				</span>
			</div>
		</div>
	);
};
