'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { getErrorMessage } from '@/lib/utils';
import { ICustomerResponse } from '@/types/customer';
import { Modal, Table as AntdTable, message } from 'antd';
import _ from 'lodash';
import { Download, Search, Upload as UploadIcon } from 'lucide-react';
import { useAdminCustomers, useMedusa } from 'medusa-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import EditCustomerModal from '../../components/edit-customer-modal';
import OrdersModal from '../../components/orders-modal';
import customerColumns from './customer-column';

type Props = {};

const DEFAULT_PAGE_SIZE = 200;
const PAGE_SIZE_OPTIONS = ['10', '50', '100', '200'];

type CustomerImportRow = {
	row_number: number;
	id?: string;
	customer_code?: string;
	email?: string;
	phone?: string;
	is_active?: boolean | string | number;
	customer_note?: string;
	metadata?: string | Record<string, unknown>;
};

type CustomerImportError = {
	row_number: number;
	identifier: string;
	field: string;
	message: string;
};

function valueOf(row: Record<string, any>, keys: string[]): any {
	for (const key of keys) {
		if (row[key] !== undefined) {
			return row[key];
		}
	}
	return '';
}

function parseImportRows(sheetRows: Record<string, any>[]): CustomerImportRow[] {
	return sheetRows
		.map((row, index) => ({
			row_number: index + 2,
			id: valueOf(row, ['id', 'ID']),
			customer_code: valueOf(row, ['customer_code', 'Mã khách hàng']),
			email: valueOf(row, ['email', 'Email']),
			phone: valueOf(row, ['phone', 'Số điện thoại']),
			is_active: valueOf(row, ['is_active', 'App', 'active']),
			customer_note: valueOf(row, ['customer_note', 'Ghi chú']),
			metadata: valueOf(row, ['metadata']),
		}))
		.filter((row) =>
			[
				row.id,
				row.customer_code,
				row.email,
				row.phone,
				row.customer_note,
			].some((value) => String(value ?? '').trim())
		);
}

async function readCustomerImportFile(file: File): Promise<CustomerImportRow[]> {
	const data = await file.arrayBuffer();
	const workbook = XLSX.read(data, { type: 'array' });
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
		defval: '',
	});
	return parseImportRows(rows);
}

const CustomerList: FC<Props> = ({}) => {
	const {
		state: stateOrders,
		onOpen: onOpenOrders,
		onClose: onCloseOrders,
	} = useToggleState(false);
	const {
		state: stateEditCustomer,
		onOpen: onOpenEditCustomer,
		onClose: onCloseEditCustomer,
	} = useToggleState(false);

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
	const [currentCustomer, setCurrentCustomer] = useState<ICustomerResponse | null>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [pendingImportRows, setPendingImportRows] = useState<CustomerImportRow[]>([]);
	const [importErrors, setImportErrors] = useState<CustomerImportError[]>([]);
	const [importSummary, setImportSummary] = useState<{ updated_count: number } | null>(
		null
	);
	const [togglingCustomerId, setTogglingCustomerId] = useState<string | null>(null);
	const { client } = useMedusa();

	const { customers, isLoading, isRefetching, count, refetch } = useAdminCustomers(
		{
			offset,
			limit: pageSize,
			q: searchValue || undefined,
			expand: 'orders,shipping_addresses',
		},
		{ keepPreviousData: true }
	);

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setNumPages(1);
			setOffset(0);
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number, nextPageSize?: number) => {
		const resolvedPageSize = nextPageSize ?? pageSize;
		setPageSize(resolvedPageSize);
		setNumPages(page);
		setOffset((page - 1) * resolvedPageSize);
	};

	const handleEditCustomer = (record: ICustomerResponse) => {
		setCurrentCustomer(record);
		onOpenEditCustomer();
	};

	const handleViewOrder = (record: ICustomerResponse) => {
		setCurrentCustomer(record);
		onOpenOrders();
	};

	const handleToggleAppAccess = async (
		record: ICustomerResponse,
		enabled: boolean
	) => {
		setTogglingCustomerId(record.id);
		try {
			await client.admin.custom.post(`/admin/customer-accounts/${record.id}`, {
				is_active: enabled,
			});
			message.success(enabled ? 'Đã bật quyền app' : 'Đã tắt quyền app');
			refetch();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setTogglingCustomerId(null);
		}
	};

	const handleExportCustomers = async () => {
		setIsExporting(true);
		try {
			const res = (await client.admin.custom.get('/admin/customer-import/export')) as {
				customers?: any[];
				data?: { customers?: any[] };
			};
			const exportCustomers = res.customers ?? res.data?.customers ?? [];
			const worksheet = XLSX.utils.json_to_sheet(exportCustomers);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'customers');
			XLSX.writeFile(workbook, `customers-${Date.now()}.xlsx`);
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setIsExporting(false);
		}
	};

	const resetImportState = () => {
		setPendingImportRows([]);
		setImportErrors([]);
		setImportSummary(null);
	};

	const handleImportFiles = async (files: File[]) => {
		if (!files.length) return;
		setIsImporting(true);
		resetImportState();
		try {
			const rows = await readCustomerImportFile(files[0]);
			if (!rows.length) {
				message.error('File không có dòng khách hàng nào');
				return;
			}

			const res = (await client.admin.custom.post('/admin/customer-import', {
				rows,
				dry_run: true,
			})) as any;

			setPendingImportRows(rows);
			setImportSummary({
				updated_count: res.updated_count ?? res.data?.updated_count ?? rows.length,
			});
			message.success('File hợp lệ, vui lòng xác nhận để cập nhật');
		} catch (error: any) {
			const errors = error?.response?.data?.errors ?? [];
			if (Array.isArray(errors) && errors.length) {
				setImportErrors(errors);
			} else {
				message.error(getErrorMessage(error));
			}
		} finally {
			setIsImporting(false);
		}
	};

	const handleConfirmImport = async () => {
		if (!pendingImportRows.length) return;
		setIsImporting(true);
		try {
			const res = (await client.admin.custom.post('/admin/customer-import', {
				rows: pendingImportRows,
				dry_run: false,
			})) as any;
			const updatedCount = res.updated_count ?? res.data?.updated_count ?? 0;
			message.success(`Đã cập nhật ${updatedCount} khách hàng`);
			setIsImportOpen(false);
			resetImportState();
			refetch();
		} catch (error: any) {
			const errors = error?.response?.data?.errors ?? [];
			if (Array.isArray(errors) && errors.length) {
				setImportErrors(errors);
			} else {
				message.error(getErrorMessage(error));
			}
		} finally {
			setIsImporting(false);
		}
	};

	const columns = useMemo(() => {
		return customerColumns({
			handleEditCustomer,
			handleViewOrder,
			handleToggleAppAccess,
			togglingCustomerId,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customers, togglingCustomerId]);

	return (
		<div className="w-full">
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Khách hàng</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4 gap-2">
				<Button
					type="default"
					icons={<Download size={16} />}
					onClick={handleExportCustomers}
					loading={isExporting}
				>
					Export
				</Button>
				<Button
					type="default"
					icons={<UploadIcon size={16} />}
					onClick={() => setIsImportOpen(true)}
				>
					Upload
				</Button>
				<Input
					// size="small"
					placeholder="Tìm mã, tên, SĐT, ghi chú..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading || isRefetching}
				columns={columns as any}
				dataSource={customers ?? []}
				rowKey="id"
				scroll={{ x: 1000 }}
				pagination={{
					total: count ?? 0,
					pageSize,
					current: numPages || 1,
					pageSizeOptions: PAGE_SIZE_OPTIONS,
					showSizeChanger: true,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} khách hàng`,
				}}
			/>
			<Modal
				title="Upload danh sách khách hàng"
				open={isImportOpen}
				onCancel={() => {
					setIsImportOpen(false);
					resetImportState();
				}}
				onOk={handleConfirmImport}
				okText="Cập nhật"
				cancelText="Hủy"
				okButtonProps={{
					disabled: !pendingImportRows.length || !!importErrors.length,
					loading: isImporting,
				}}
				confirmLoading={isImporting}
				width={900}
			>
				<Upload
					onFileChosen={handleImportFiles}
					filetypes={[
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						'application/vnd.ms-excel',
						'text/csv',
					]}
					placeholder="Hỗ trợ .xlsx, .xls, .csv"
					text={
						<span>
							Di chuyển file khách hàng tới đây, hoặc{' '}
							<span className="text-sky-500">click để chọn file.</span>
						</span>
					}
				/>
				{importSummary && !importErrors.length && (
					<div className="mt-4 text-sm text-green-600">
						File hợp lệ. Sẽ cập nhật {importSummary.updated_count} khách hàng.
					</div>
				)}
				{!!importErrors.length && (
					<div className="mt-4">
						<div className="mb-2 text-sm text-red-600">
							File có lỗi nên chưa cập nhật khách hàng nào.
						</div>
						<AntdTable
							size="small"
							rowKey={(record) =>
								`${record.row_number}-${record.field}-${record.identifier}`
							}
							pagination={{ pageSize: 5 }}
							dataSource={importErrors}
							columns={[
								{ title: 'Dòng', dataIndex: 'row_number', width: 80 },
								{ title: 'Khách', dataIndex: 'identifier', width: 180 },
								{ title: 'Cột', dataIndex: 'field', width: 120 },
								{ title: 'Lỗi', dataIndex: 'message' },
							]}
						/>
					</div>
				)}
			</Modal>
			{currentCustomer && stateEditCustomer && (
				<EditCustomerModal
					state={stateEditCustomer}
					handleOk={() => {
						onCloseEditCustomer();
						setCurrentCustomer(null);
					}}
					handleCancel={() => {
						onCloseEditCustomer();
						setCurrentCustomer(null);
					}}
					customer={currentCustomer}
				/>
			)}
			{currentCustomer && stateOrders && (
				<OrdersModal
					state={stateOrders}
					handleOk={() => {
						onCloseOrders();
						setCurrentCustomer(null);
					}}
					handleCancel={() => {
						onCloseOrders();
						setCurrentCustomer(null);
					}}
					customerId={currentCustomer.id}
				/>
			)}
		</div>
	);
};

export default CustomerList;
