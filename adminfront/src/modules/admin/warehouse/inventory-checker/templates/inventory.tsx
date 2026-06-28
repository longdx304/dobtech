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
import { message } from 'antd';
import debounce from 'lodash/debounce';
import { RefreshCw, Search } from 'lucide-react';
import { ChangeEvent, FC, Key, useState } from 'react';
import { inventoryColumns } from './columns';

type Props = {};

const DEFAULT_PAGE_SIZE = 20;

const InventoryChecker: FC<Props> = ({}) => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

	const { user } = useUser();
	const isAdmin = (user as any)?.role === 'admin';

	const { data, isLoading, refetch } = useAdminWarehousesInventoryVariant({
		q: searchValue || undefined,
		limit: DEFAULT_PAGE_SIZE,
		offset,
	});

	const { mutate: syncInventory, isLoading: isSyncing } = useSyncInventory({
		onSuccess: (response: any) => {
			const result = response?.data ?? response;
			const syncedCount = Number(result?.synced_count ?? 0);
			if (syncedCount > 0) {
				message.success(`Đã đồng bộ ${syncedCount} sản phẩm`);
			} else {
				message.success('Không còn sản phẩm lệch tồn');
			}
			setSelectedRowKeys([]);
			refetch();
		},
		onError: (error: any) => {
			message.error(getErrorMessage(error));
		},
	});

	const handleSyncInventory = () => {
		syncInventory({});
	};

	const handleSyncSelectedInventory = () => {
		if (!selectedRowKeys.length) {
			return;
		}
		syncInventory({
			variant_ids: selectedRowKeys.map(String),
		});
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
	const columns = inventoryColumns({});
	const selectedCount = selectedRowKeys.length;

	return (
		<Flex vertical gap={12}>
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
						<Flex align="center" gap={8}>
							<Button
								onClick={handleSyncSelectedInventory}
								loading={isSyncing}
								disabled={!selectedCount}
							>
								Đồng bộ mục đã chọn
							</Button>
							<Button
								type="primary"
								icon={<RefreshCw size={16} />}
								onClick={handleSyncInventory}
								loading={isSyncing}
							>
								Đồng bộ kho
							</Button>
						</Flex>
					)}
				</Flex>
				<Flex align="center" justify="space-between" className="py-4">
					<Text className="text-gray-600">
						{selectedCount
							? `Đã chọn ${selectedCount} sản phẩm lệch tồn`
							: '0 sản phẩm được chọn'}
					</Text>
					<Input
						placeholder="Tìm kiếm vị trí hoặc sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-[300px]"
					/>
				</Flex>
				<Table
					dataSource={data}
					loading={isLoading}
					rowKey="variant_id"
					rowSelection={
						isAdmin
							? {
									selectedRowKeys,
									onChange: (keys) => setSelectedRowKeys(keys),
								}
							: undefined
					}
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
