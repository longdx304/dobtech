'use client';

import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Tooltip } from '@/components/Tooltip';
import { Title } from '@/components/Typography';
import { useAdminSuppliers } from '@/lib/hooks/api/supplier';
import { useAdminSupplierOrders } from '@/lib/hooks/api/supplier-order';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { ERoutes } from '@/types/routes';
import { FulfillSupplierOrderStt, SupplierOrders } from '@/types/supplier';
import { SupplierOrder } from '@/types/supplier-order';
import { FloatButton, TableProps } from 'antd';
import _ from 'lodash';
import { FileSpreadsheet, NotepadTextDashed, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import ExportModals from '../components/export-excel/export-modals';
import SupplierOrdersModal from '../components/supplier-orders-modal';
import SupplierOrdersSample from '../components/supplier-orders-sample';
import { useSupplierOrderExport } from '../hooks/use-supplier-order-export';
import supplierOrdersColumn from './supplier-order-column';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const SupplierOrdersList: FC<Props> = () => {
	const {
		state: stateSupplierOrdersModal,
		onOpen: openSupplierOrdersModal,
		onClose: closeSupplierOrdersModal,
	} = useToggleState(false);

	const {
		state: stateSampleOrderModal,
		onOpen: openSampleOrderModal,
		onClose: closeSampleOrderModal,
	} = useToggleState(false);

	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentSupplierOrders, setCurrentSupplierOrders] =
		useState<SupplierOrders | null>(null);
	const [filters, setFilters] = useState<any>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	// Export hook
	const exportHook = useSupplierOrderExport();

	const { supplierOrders, isLoading, isRefetching, count } =
		useAdminSupplierOrders({
			q: searchValue || '',
			status: filters.status || undefined,
			fulfillment_status: filters.fulfillment_status || undefined,
			offset,
			limit: DEFAULT_PAGE_SIZE,
			expand: 'supplier',
		});

	// fetch suppliers for choosing supplier in order
	const { suppliers } = useAdminSuppliers({
		q: '',
		offset,
		limit: 100,
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

	const handleCreateSupplierOrders = () => {
		setCurrentSupplierOrders(null);
		openSupplierOrdersModal();
	};

	const handleOpenSampleOrderModal = () => {
		openSampleOrderModal();
	};

	const columns = useMemo(() => {
		return supplierOrdersColumn({
			supplier: suppliers ?? [],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [suppliers]);

	const handleCloseModal = () => {
		closeSupplierOrdersModal();
		setCurrentSupplierOrders(null);
	};

	const handleCloseSampleOrderModal = () => {
		closeSampleOrderModal();
	};

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.SUPPLIER_ORDERS}/${record.id}`);
	};

	const handleOnChange: TableProps<any>['onChange'] = (
		pagination,
		filters,
		sorter,
		extra
	) => {
		const formattedFilters = Object.entries(filters).reduce(
			(acc, [key, value]) => {
				if (Array.isArray(value) && value.length > 0) {
					acc[key] = value.map(String);
				}
				return acc;
			},
			{} as Record<string, string[]>
		);
		setFilters(formattedFilters);
	};

	const selectedSupplierOrders =
		supplierOrders?.filter((order) => selectedRowKeys.includes(order.id)) || [];

	return (
		<>
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Đơn đặt hàng</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					placeholder="Tìm kiếm đơn đặt hàng..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading || isRefetching}
				columns={(columns as any) ?? []}
				dataSource={supplierOrders ?? []}
				rowKey="id"
				rowSelection={{
					selectedRowKeys,
					onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
					getCheckboxProps: (record: any) => ({
						disabled: record.fulfillment_status !== FulfillSupplierOrderStt.INVENTORIED,
					}),
				}}
				onRow={(record) => ({
					onClick: (e) => {
						// Prevent row click when clicking on checkbox
						const target = e.target as HTMLElement;
						if (!target.closest('.ant-checkbox-wrapper')) {
							handleRowClick(record);
						}
					},
					className: 'cursor-pointer',
				})}
				scroll={{ x: 700 }}
				onChange={handleOnChange}
				pagination={{
					total: count ?? 0,
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} đơn hàng`,
				}}
			/>

			<FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
				{selectedRowKeys.length > 0 && (
					<Tooltip title="Xuất Excel" placement="left">
						<FloatButton
							icon={<FileSpreadsheet color="white" size={20} strokeWidth={2} />}
							type="primary"
							onClick={() => exportHook.handleOpenExportModal(selectedRowKeys)}
							data-testid="btnExportSupplierOrders"
						/>
					</Tooltip>
				)}
				<Tooltip title="Tạo đơn đặt hàng" placement="left">
					<FloatButton
						icon={<Plus color="white" size={20} strokeWidth={2} />}
						type="primary"
						onClick={handleCreateSupplierOrders}
						data-testid="btnCreateSupplier"
					/>
				</Tooltip>
				<Tooltip title="Tạo bản mẫu đơn đặt hàng" placement="left">
					<FloatButton
						icon={<NotepadTextDashed color="black" size={20} strokeWidth={2} />}
						type="default"
						onClick={handleOpenSampleOrderModal}
						data-testid="btnAnotherAction"
					/>
				</Tooltip>
			</FloatButton.Group>
			{stateSupplierOrdersModal && (
				<SupplierOrdersModal
					state={stateSupplierOrdersModal}
					handleOk={handleCloseModal}
					handleCancel={handleCloseModal}
					suppliers={suppliers || []}
				/>
			)}

			{stateSampleOrderModal && (
				<SupplierOrdersSample
					state={stateSampleOrderModal}
					handleOk={handleCloseSampleOrderModal}
					handleCancel={handleCloseSampleOrderModal}
					suppliers={suppliers || []}
				/>
			)}

			<ExportModals
				vatModalVisible={exportHook.vatModalVisible}
				vatRate={exportHook.vatRate}
				tiGia={exportHook.tiGia}
				onVatRateChange={exportHook.setVatRate}
				onTiGiaChange={exportHook.setTiGia}
				onVatNext={() =>
					exportHook.handleVatNext(selectedRowKeys, selectedSupplierOrders as SupplierOrder[])
				}
				onVatCancel={exportHook.handleVatCancel}
				exportModalVisible={exportHook.exportModalVisible}
				selectedSupplierOrders={selectedSupplierOrders as SupplierOrder[]}
				soChungTuValues={exportHook.soChungTuValues}
				soPhieuNhapValues={exportHook.soPhieuNhapValues}
				onSoChungTuChange={exportHook.handleSoChungTuChange}
				onSoPhieuNhapChange={exportHook.handleSoPhieuNhapChange}
				onDocumentNext={() =>
					exportHook.handleDocumentModalNext(selectedSupplierOrders as SupplierOrder[], () =>
						setSelectedRowKeys([])
					)
				}
				onDocumentCancel={exportHook.handleCloseExportModal}
			/>
		</>
	);
};

export default SupplierOrdersList;
