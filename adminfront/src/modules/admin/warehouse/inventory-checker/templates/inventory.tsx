'use client';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Text, Title } from '@/components/Typography';
import { useSyncInventory } from '@/lib/hooks/api/product/mutations';
import { useAdminWarehousesInventoryVariant } from '@/lib/hooks/api/warehouse';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import { Alert, message, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { RefreshCw, Search } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';
import { inventoryColumns } from './columns';

type Props = {};

const DEFAULT_PAGE_SIZE = 20;

const InventoryChecker: FC<Props> = ({}) => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [syncingVariantId, setSyncingVariantId] = useState<string | null>(null);

	const { user } = useUser();
	const isAdmin = (user as any)?.role === 'admin';

	const { data, isLoading, refetch } = useAdminWarehousesInventoryVariant({
		q: searchValue || undefined,
		limit: DEFAULT_PAGE_SIZE,
		offset,
	});

	const { mutate: syncAllInventory, isLoading: isSyncingAll } = useSyncInventory({
		onSuccess: () => {
			message.success('Đồng bộ kho thành công!', 5);
			refetch();
		},
		onError: (error: any) => {
			message.error(getErrorMessage(error) || 'Đồng bộ kho thất bại!', 6);
		},
	});

	const { mutateAsync: syncVariantInventory } = useSyncInventory();

	const handleSyncInventory = () => {
		syncAllInventory(undefined);
	};

	const handleSyncVariant = async (record: any) => {
		if (!record?.variant_id) {
			message.error('Không tìm thấy sản phẩm cần đồng bộ', 6);
			return;
		}

		const inventoryQuantity = Number(record.inventory_quantity ?? 0);
		const expectedQuantity = Number(
			record.expected_inventory_quantity ?? inventoryQuantity
		);
		const committedQuantity = Number(record.committed_quantity ?? 0);

		if (expectedQuantity === inventoryQuantity) {
			if (committedQuantity > 0) {
				message.info(
					`Sổ sản phẩm đã đúng theo tồn khả dụng. Lệch này do còn ${committedQuantity} sản phẩm trong đơn chờ xuất kho.`,
					7
				);
				return;
			}

			message.info('Sổ sản phẩm đã đúng, không cần đồng bộ.', 5);
			return;
		}

		setSyncingVariantId(record.variant_id);
		try {
			await syncVariantInventory({ variant_ids: [record.variant_id] });
			if (committedQuantity > 0) {
				message.success(
					`Đã đồng bộ sổ sản phẩm. Sản phẩm vẫn có thể còn lệch do ${committedQuantity} sản phẩm đang chờ xuất kho.`,
					7
				);
			} else {
				message.success('Đồng bộ sản phẩm thành công!', 5);
			}
			refetch();
		} catch (error: any) {
			message.error(getErrorMessage(error) || 'Đồng bộ sản phẩm thất bại!', 6);
		} finally {
			setSyncingVariantId(null);
		}
	};

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		if (inputValue === '') {
			setOffset(0);
			setNumPages(1);
			setSearchValue(inputValue);
			refetch();
			return;
		}
		setSearchValue(inputValue.trim());
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};
	const columns = inventoryColumns({
		isAdmin,
		onSyncVariant: handleSyncVariant,
		syncingVariantId,
		disabled: isSyncingAll || !!syncingVariantId,
	});
	const mismatchCount = Array.isArray(data) ? data.length : 0;

	return (
		<Flex vertical gap={12}>
			<Spin fullscreen spinning={isSyncingAll} tip="Đang đồng bộ kho..." />
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Danh sách vị trí kho</Title>
				<Text className="text-gray-600">
					Trang danh sách các sản phẩm ở từng vị trí kho.
				</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Flex align="center" justify="space-between" className="mb-4">
					<Title level={4}>Vị trí kho</Title>
					{isAdmin && (
						<Button
							type="primary"
							icon={<RefreshCw size={16} />}
							onClick={handleSyncInventory}
							loading={isSyncingAll}
						>
							Đồng bộ kho
						</Button>
					)}
				</Flex>
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm vị trí hoặc sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-[300px]"
					/>
				</Flex>
				{mismatchCount > 0 && (
					<Alert
						type="warning"
						showIcon
						className="mb-4"
						message={`Có ${mismatchCount} sản phẩm đang lệch giữa sổ kho và sổ sản phẩm trong trang này.`}
					/>
				)}
				<Table
					dataSource={data}
					loading={isLoading}
					rowKey="variant_id"
					columns={columns as any}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						// total: count,
						// showTotal: (total, range) =>
						// 	`${range[0]}-${range[1]} trong ${total} vị trí`,
					}}
				/>
			</Card>
		</Flex>
	);
};

export default InventoryChecker;
