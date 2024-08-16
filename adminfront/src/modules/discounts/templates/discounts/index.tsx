'use client';

import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { ERoutes } from '@/types/routes';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';
import _ from 'lodash';
import discountColumns from './discount-column';
import { Discount } from '@medusajs/medusa';
import { FloatButton } from '@/components/Button';
import { useAdminDiscounts } from 'medusa-react';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import AddDiscountModal from '../../components/modal/add-discount';
import { DiscountFormProvider } from '../../components/discount-form/discount-form-context';

const DEFAULT_PAGE_SIZE = 10;
const DiscountList = () => {
	const router = useRouter();

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);

	const { state, onOpen, onClose } = useToggleState(false);
	const { discounts, isLoading, count } = useAdminDiscounts(
		{
			is_dynamic: false,
			expand: 'rule,rule.conditions,rule.conditions.products,regions',
			limit: DEFAULT_PAGE_SIZE,
			offset: offset,
			q: searchValue || undefined,
		},
		{
			keepPreviousData: true,
		}
	);

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

	const handleEdit = (record: Discount) => {};
	const handleChangeStatus = (id: Discount['id'], status: boolean) => {};
	const handleDelete = (id: Discount['id']) => {};
	const handleDuplicate = (id: Discount['id']) => {};

	const columns = useMemo(() => {
		return discountColumns({
			handleEdit,
			handleChangeStatus,
			handleDelete,
			handleDuplicate,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.DISCOUNTS}/${record.id}`);
	};

	return (
		<Card className="w-full" bordered={false}>
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Giảm giá</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					// size="small"
					name="search"
					placeholder="Tìm kiếm đơn hàng..."
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading}
				columns={columns as any}
				dataSource={discounts ?? []}
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
			<FloatButton
				className="top-1/3"
				icon={<Plus color="white" size={20} />}
				type="primary"
				onClick={onOpen}
				data-testid="btnCreateProduct"
			/>
			<DiscountFormProvider>
				{state && <AddDiscountModal state={state} handleCancel={onClose} />}
			</DiscountFormProvider>
		</Card>
	);
};

export default DiscountList;
