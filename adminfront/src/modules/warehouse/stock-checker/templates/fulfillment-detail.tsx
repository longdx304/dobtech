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
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { Divider, message } from 'antd';
import debounce from 'lodash/debounce';
import { ArrowLeft, Check, Clock, Hash, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import fulfillmentColumns from './columns';

type FulfillmentDetailProps = {
	id: string;
};

const FulfillmentDetail = ({ id }: FulfillmentDetailProps) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [files, setFiles] = useState<FormImage[]>([]);

	const { fulfillment, isLoading } = useAdminFulfillment(id);
	const updateFulfillment = useAdminUpdateFulfillment(id);
	const uploadFile = useAdminUploadFile();

	const isProcessing = !fulfillment?.checked_at;

	useEffect(() => {
		if (!isProcessing) {
			const items = fulfillment.items.map((item) => item.item_id);
			setSelectedRowKeys(items);
			if (fulfillment?.checker_url?.length) {
				setFiles(
					fulfillment.checker_url.split(',').map((url, index) => ({
						id: url,
						url,
						name: `Ảnh #${index + 1}`,
					}))
				);
			}
		}

		//eslint-disable-next-line
	}, [fulfillment?.checker_url]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const itemTable = useMemo(() => {
		if (!fulfillment) return [];
		return fulfillment.items.filter(({ item }: any) =>
			item.title.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [fulfillment, searchValue]);

	const handleBackToList = () => {
		router.push(ERoutes.WAREHOUSE_STOCK_CHECKER);
	};

	const handleRowSelectionChange = (selectedRowKeys: string[]) => {
		setSelectedRowKeys(selectedRowKeys);
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
					prefix: 'warehouse/stock-checker',
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
					checker_url: allUrls.join(','),
				},
				{
					onSuccess: () => {
						message.success('Kiểm hàng thành công');
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

	if (!fulfillment) return null;

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
				<OrderInfo order={fulfillment!.order} isProcessing={isProcessing} />
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
					<Text className="text-gray-500 text-xs">{`Đã kiểm ${
						selectedRowKeys?.length ?? 0
					} trong ${itemTable?.length}`}</Text>
					<Table
						columns={fulfillmentColumns as any}
						dataSource={itemTable}
						rowKey="item_id"
						showHeader={false}
						rowSelection={{
							type: 'checkbox',
							selectedRowKeys: selectedRowKeys,
							onChange: handleRowSelectionChange as any,
							preserveSelectedRowKeys: true,
							getCheckboxProps: (record: any) => ({
								disabled: !isProcessing,
							}),
						}}
					/>
					<Divider />
					<UploadTemplate
						files={files}
						setFiles={setFiles}
						hiddenUpload={!isProcessing}
					/>

					<Button
						disabled={!isProcessing}
						onClick={onConfirm}
						loading={updateFulfillment.isLoading || uploadFile.isLoading}
						type="primary"
						className="w-full sm:w-[200px]"
					>
						{isProcessing ? 'Kiểm hàng' : 'Đã kiểm hàng'}
					</Button>
				</Flex>
			</Card>
		</Flex>
	);
};

export default FulfillmentDetail;

const OrderInfo = ({
	order,
	isProcessing = false,
}: {
	order: Order;
	isProcessing: boolean;
}) => {
	const address = `${order.shipping_address?.address_2 ?? ''} ${
		order.shipping_address?.city ?? ''
	} ${order.shipping_address?.address_1 ?? ''} ${
		order.shipping_address?.province ?? ''
	} ${order.shipping_address?.country_code ?? ''}`;

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
						{`${order?.display_id} - ${order.customer.last_name ?? ''} ${
							order.customer.first_name ?? ''
						} - ${order.customer.phone ?? ''}`}
					</Text>
				</Flex>
				<Flex gap={4} className="" align="center">
					<div className="flex items-center">
						<MapPin color="#6b7280" width={18} height={18} />
					</div>
					<Text className="text-sm font-semibold">{address}</Text>
				</Flex>
			</Flex>
		</div>
	);
};
