'use client';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { ProductVariant } from '@medusajs/medusa';
import _ from 'lodash';
import { Search } from 'lucide-react';
import { useAdminVariants } from 'medusa-react';
import { ChangeEvent, useEffect, useState } from 'react';
import productsColumns from './products-column';

type AddProductVariantProps = {
	state: boolean;
	onClose: () => void;
	regionId: string;
	currencyCode: string;
	customerId: string;
	isReplace?: boolean;
	isLoading?: boolean;
	onSubmit: (variantIds: string[], variants?: ProductVariant[]) => void;
	title: string;
	selectedItems?: string[];
};

const PAGE_SIZE = 10;

const AddProductVariant = (props: AddProductVariantProps) => {
	const { isReplace, regionId, currencyCode, customerId } = props;
	const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
	const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>(
		[]
	);
	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);

	const { isLoading, count, variants } = useAdminVariants({
		q: searchValue,
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
		region_id: regionId,
		customer_id: customerId,
	});

	useEffect(() => {
		if (props.selectedItems) {
			setSelectedVariantIds(props.selectedItems);
		} else {
			setSelectedVariantIds([]);
			setSelectedVariants([]);
		}
	}, [props.selectedItems]);

	const onSubmit = async () => {
		// wait until onSubmit is done to reduce list jumping
		await props.onSubmit(selectedVariantIds, selectedVariants);
		// setSelectedVariantIds([]);
		props.onClose();
	};

	const onBack = () => {
		setSelectedVariantIds([]);
		setSelectedVariants([]);
	};

	const handleRowSelectionChange = (
		selectedRowKeys: React.Key[] | string[],
		selectedRows: ProductVariant[]
	) => {
		setSelectedVariantIds(selectedRowKeys as string[]);
		setSelectedVariants(selectedRows as ProductVariant[]);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const variantInventoryCell = (record: ProductVariant) => {
		return <></>;
	};

	const columns = productsColumns({ variantInventoryCell, currencyCode });

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const handleDisable = (record: any) => {
		if (record?.inventory_quantity || record?.original_price_incl_tax) {
			return false;
		}
		return true;
	};
	return (
		<Modal
			open={props.state}
			handleOk={onSubmit}
			isLoading={props?.isLoading}
			disabled={props?.isLoading}
			handleCancel={props.onClose}
			width={800}
		>
			<Title level={4} className="text-center">
				{props.title ?? 'Thêm biến thể sản phẩm'}
			</Title>
			<Flex
				align="center"
				justify="flex-end"
				className="p-4 border-0 border-b border-solid border-gray-200"
			>
				<Input
					placeholder="Nhập tên sản phẩm"
					className="w-[200px] text-xs"
					size="small"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
				/>
			</Flex>
			<Table
				rowSelection={{
					type: isReplace ? 'radio' : 'checkbox',
					selectedRowKeys: selectedVariantIds,
					onChange: handleRowSelectionChange as any,
					preserveSelectedRowKeys: true,
					getCheckboxProps: (record: any) => ({
						disabled: handleDisable(record),
					}),
				}}
				loading={isLoading}
				columns={columns as any}
				dataSource={variants ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} biến thể sản phẩm`,
				}}
				// scroll={{ x: 700 }}
			/>
		</Modal>
	);
};

export default AddProductVariant;
