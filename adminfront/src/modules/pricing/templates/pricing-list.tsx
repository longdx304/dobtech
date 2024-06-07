'use client';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { Plus, Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import _ from 'lodash';
import { Card } from '@/components/Card';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { Table } from '@/components/Table';
import { FloatButton } from '@/components/Button';
import { useAdminPriceLists } from 'medusa-react';
import pricingColumns from './pricing-column';
import PricingCreate from '@/modules/pricing/components/pricing-modal/pricing-create';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const PricingList: FC<Props> = ({}) => {
	const {
		state: statePricing,
		onOpen: onOpenPricing,
		onClose: onClosePricing,
	} = useToggleState(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentPricing, setCurrentPricing] = useState<any>(null);
	const [pricingId, setPricingId] = useState<string>('');

	const [currentPage, setCurrentPage] = useState(1);

	const { price_lists, isLoading, isRefetching, count } = useAdminPriceLists({
		offset,
		limit: DEFAULT_PAGE_SIZE,
		q: searchValue || undefined,
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
		return pricingColumns({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [price_lists]);

	return (
		<Card className="w-full" bordered={false}>
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Quản lý định giá</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					// size="small"
					placeholder="Tìm kiếm bộ sưu tập..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading || isRefetching}
				columns={columns as any}
				dataSource={price_lists ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: Math.floor(count ?? 0 / (DEFAULT_PAGE_SIZE ?? 0)),
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages || 1,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} bộ sưu tập`,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} />}
				type="primary"
				onClick={onOpenPricing}
				// data-testid="btnCreateProduct"
			/>
			<PricingCreate
				state={statePricing}
				handleOk={onClosePricing}
				handleCancel={onClosePricing}
			/>
		</Card>
	);
};

export default PricingList;
