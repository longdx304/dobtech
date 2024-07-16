'use client';
import { useState, ChangeEvent, useMemo } from 'react';
import { ProductVariant } from '@medusajs/medusa';
import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { Flex } from '@/components/Flex';
import { Tooltip } from '@/components/Tooltip';
import { Input } from '@/components/Input';
import productsColumns from './products-column';
import { Search, LoaderCircle } from 'lucide-react';
import { useAdminVariants, useAdminVariantsInventory } from "medusa-react";
import useStockLocations from '@/modules/orders/hooks/use-stock-locations';
import _ from 'lodash';

type AddProductVariantProps = {
	state: boolean;
	onClose: () => void;
	regionId: string;
	currencyCode: string;
	customerId: string;
	isReplace?: boolean;
	isLoading?: boolean;
	// onSubmit: (variants: ProductVariant[]) => void;
	title: string;
};

const PAGE_SIZE = 10;

const AddProductVariant = (props: AddProductVariantProps) => {
	const { isReplace, regionId, currencyCode, customerId } =
    props;
	const [selectedVariants, setSelectedVariants] = useState<string[]>(
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
  })

	const onSubmit = async () => {
		// wait until onSubmit is done to reduce list jumping
		await props.onSubmit(selectedVariants);
		setSelectedVariants([]);
		props.onClose();
	};

	const onBack = () => {
		setSelectedVariants([]);
	};

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedVariants(selectedRowKeys);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const variantInventoryCell = (record: ProductVariant) => {
		// const { getLocationNameById } = useStockLocations();
			// const { variant, isLoading } = useAdminVariantsInventory(record.id);
			// console.log('variant', variant)

		// 	if (isLoading) {
		// 		return <LoaderCircle className="animate-spin" />
		// 	}
		// 	if (!isLoading && !variant?.inventory?.length) {
		// 		return <div className="">{record.inventory_quantity}</div>
		// 	}

		// 	const { inventory } = variant

		// 	const total = inventory[0].location_levels.reduce(
		// 		(sum: number, location_level: InventoryLevelDTO) =>
		// 			(sum += location_level.stocked_quantity),
		// 		0
		// 	)

			// const LocationTooltip = (
			// 	<>
			// 		{inventory[0].location_levels.map(
			// 			(location_level: InventoryLevelDTO) => (
			// 				<div key={location_level.id} className="font-normal">
			// 					<span className="font-semibold">
			// 						{location_level.stocked_quantity}
			// 					</span>
			// 						{`Tại ${location: getLocationNameById(location_level.location_id)}`}
			// 				</div>
			// 			)
			// 		)}
			// 	</>
			// );

			return (
				<></>
				// <Tooltip title={'LocationTooltip'}>
				// 	<div className="">
				// 		{total} in {inventory[0].location_levels.length}{" "}
				// 		{_.pluralize("location", inventory[0].location_levels.length)}
				// 	</div>
				// </Tooltip>
			)
	}

	const columns = productsColumns({ variantInventoryCell, currencyCode });

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
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
					selectedRowKeys: selectedVariants,
					onChange: handleRowSelectionChange,
					preserveSelectedRowKeys: true,
					// getCheckboxProps: (record) => ({
					// 	disabled: productIds?.includes(record.id),
					// }),
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
