'use client';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import _ from 'lodash';
import { Table } from '@/components/Table';
import { useAdminOrders } from 'medusa-react';
import orderColumns from './order-column';
import { useFeatureFlag } from '@/lib/providers/feature-flag-provider';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import { Region } from '@medusajs/medusa';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;
const defaultQueryProps = {
  expand: "customer,shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

const OrderList: FC<Props> = ({}) => {
	const router = useRouter();
	const { isFeatureEnabled } = useFeatureFlag()

  let hiddenColumns = ["sales_channel"]
  if (isFeatureEnabled("sales_channels")) {
    if (!defaultQueryProps.expand.includes("sales_channel")) {
      defaultQueryProps.expand = defaultQueryProps.expand + ",sales_channel"
    }
    hiddenColumns = []
  }

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
	const [regionId, setRegionId] = useState<Region['id'] | null>(null);

	const { orders, isLoading, count } = useAdminOrders(defaultQueryProps as any, {
    keepPreviousData: true,
  });

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const columns = useMemo(() => {
		return orderColumns({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orders]);

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.ORDERS}/${record.id}`)
  };

	return (
		<div className="w-full">
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					// size="small"
					placeholder="Tìm kiếm đơn hàng..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading}
				columns={columns as any}
				dataSource={orders ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					className: 'cursor-pointer',
				})}
				pagination={{
					total: Math.floor(count ?? 0 / (DEFAULT_PAGE_SIZE ?? 0)),
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages || 1,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} đơn hàng`,
				}}
			/>
		</div>
	);
};

export default OrderList;
