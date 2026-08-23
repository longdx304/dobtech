'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { useQuery } from '@tanstack/react-query';
import { DatePicker, Form, Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { Download, Search } from 'lucide-react';
import { useMedusa } from 'medusa-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

type OperationsRow = {
	id: string;
	display_id: number;
	misa_document_number: string;
	misa_stock_out_number: string;
	misa_first_exported_at: string;
	misa_pair_quantity: number | null;
	preparers: string;
	checkers: string;
	shippers: string;
	delivery_assistants: string;
	has_misa_snapshot: boolean;
};

type LegacyRow = {
	id: string;
	display_id: number;
	created_at: string;
	suggested_exported_at?: string | null;
};

const toParams = (values: Record<string, string | number | undefined>) => {
	const params = new URLSearchParams();
	Object.entries(values).forEach(([key, value]) => {
		if (value !== undefined && value !== '') params.set(key, String(value));
	});
	const query = params.toString();
	return query ? `?${query}` : '';
};

export default function OperationsReport() {
	const { client } = useMedusa();
	const [q, setQ] = useState('');
	const [range, setRange] = useState<[string | undefined, string | undefined]>([undefined, undefined]);
	const [page, setPage] = useState(1);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [legacy, setLegacy] = useState<LegacyRow | null>(null);
	const [legacyForm] = Form.useForm();
	const query = useQuery({
		queryKey: ['operations-report', q, range, page],
		queryFn: () => client.admin.custom.get(`/admin/management/operations-report${toParams({
			q: q.trim() || undefined,
			from: range[0],
			to: range[1],
			offset: (page - 1) * 50,
			limit: 50,
		})}`),
		keepPreviousData: true,
	});
	const legacyQuery = useQuery({
		queryKey: ['operations-report-legacy'],
		queryFn: () => client.admin.custom.get('/admin/management/operations-report/legacy'),
	});
	const report = query.data as { operations?: OperationsRow[]; count?: number } | undefined;
	const legacyRows = ((legacyQuery.data as { operations?: LegacyRow[] } | undefined)?.operations ?? []);

	const downloadSnapshot = useCallback(async (record: OperationsRow) => {
		try {
			const response = await client.admin.custom.get(`/admin/management/operations-report/${record.id}/misa-export`) as any;
			const snapshot = response.misa_export ?? response.data?.misa_export;
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(snapshot.rows ?? []), snapshot.export_type || 'MISA');
			XLSX.writeFile(workbook, `MISA_${snapshot.misa_document_number}.xlsx`);
		} catch (error: any) {
			message.error(error?.response?.data?.message || 'Không tìm thấy snapshot file MISA');
		}
	}, [client]);

	const columns = useMemo(() => [
		{ title: 'STT', key: 'stt', width: 70, render: (_: unknown, __: OperationsRow, index: number) => (page - 1) * 50 + index + 1 },
		{
			title: 'Số đơn',
			dataIndex: 'display_id',
			key: 'display_id',
			width: 110,
			render: (displayId: number, record: OperationsRow) => (
				<Link className="text-blue-600 hover:underline" href={`/admin/orders/${record.id}`}>
					#{displayId}
				</Link>
			),
		},
		{ title: 'Đơn hàng', dataIndex: 'misa_document_number', key: 'misa_document_number', width: 150 },
		{ title: 'Bao', key: 'bags', width: 90, render: () => '' },
		{ title: 'Bịch', key: 'packs', width: 90, render: () => '' },
		{ title: 'Đôi', dataIndex: 'misa_pair_quantity', key: 'misa_pair_quantity', width: 90, render: (value: number | null) => value ?? '' },
		{ title: 'Người soạn', dataIndex: 'preparers', key: 'preparers' },
		{ title: 'Người kiểm', dataIndex: 'checkers', key: 'checkers' },
		{ title: 'Người giao', dataIndex: 'shippers', key: 'shippers' },
		{ title: 'Phụ xe', dataIndex: 'delivery_assistants', key: 'delivery_assistants' },
		{ title: 'File MISA', key: 'snapshot', width: 130, render: (_: unknown, record: OperationsRow) => record.has_misa_snapshot ? <Button size="small" onClick={() => downloadSnapshot(record)}>Tải lại</Button> : 'Chưa lưu' },
	], [page, downloadSnapshot]);

	const exportExcel = () => {
		const selectedRows = (report?.operations ?? []).filter((item) => selectedRowKeys.includes(item.id));
		if (selectedRows.length === 0) {
			message.warning('Chọn ít nhất một đơn hàng để xuất báo cáo Excel');
			return;
		}
		try {
			const rows = selectedRows.map((item, index) => ({
				STT: index + 1,
				'Đơn hàng': item.misa_document_number,
				Bao: '',
				Bịch: '',
				Đôi: item.misa_pair_quantity ?? '',
				'Người soạn': item.preparers,
				'Người Kiểm': item.checkers,
				'Người giao': item.shippers,
				'Phụ xe': item.delivery_assistants,
			}));
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Báo cáo vận hành');
			XLSX.writeFile(workbook, `bao-cao-van-hanh-${dayjs().format('YYYYMMDD-HHmm')}.xlsx`);
		} catch {
			message.error('Không thể xuất báo cáo Excel');
		}
	};

	const confirmAllLegacy = () => {
		Modal.confirm({
			title: 'Xác nhận tất cả đơn MISA cũ?',
			content: 'Hệ thống sẽ dùng mã gợi ý BHYYMM-display_id và XKYYMM-display_id. Các đơn có mã MISA thực tế khác cần chỉnh riêng sau đó.',
			okText: 'Xác nhận tất cả',
			cancelText: 'Hủy',
			onOk: async () => {
				const response = await client.admin.custom.post('/admin/management/operations-report/legacy/confirm-all', {}) as any;
				const result = response.data ?? response;
				message.success(`Đã xác nhận ${result.confirmed ?? 0} đơn MISA cũ`);
				if (result.failed?.length) {
					message.warning(`${result.failed.length} đơn cần xác nhận riêng`);
				}
				await Promise.all([query.refetch(), legacyQuery.refetch()]);
			},
		});
	};

	const openLegacy = (record: LegacyRow) => {
		setLegacy(record);
		legacyForm.setFieldsValue({
			misa_document_number: `BH${dayjs(record.created_at).format('YYMM')}-${record.display_id}`,
			misa_stock_out_number: `XK${dayjs(record.created_at).format('YYMM')}-${record.display_id}`,
			misa_first_exported_at: record.suggested_exported_at ? dayjs(record.suggested_exported_at) : dayjs(record.created_at),
		});
	};

	const confirmLegacy = async () => {
		if (!legacy) return;
		try {
			const values = await legacyForm.validateFields();
			await client.admin.custom.post(`/admin/management/operations-report/legacy/${legacy.id}`, {
				...values,
				misa_first_exported_at: values.misa_first_exported_at.toISOString(),
			});
			message.success('Đã xác nhận đơn MISA cũ');
			setLegacy(null);
			query.refetch();
			legacyQuery.refetch();
		} catch (error: any) {
			if (error?.errorFields) return;
			message.error(error?.response?.data?.message || 'Không thể xác nhận đơn MISA cũ');
		}
	};

	return (
		<Card className="w-full" bordered={false}>
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<Title level={3}>Báo cáo vận hành</Title>
				<Button icon={<Download size={16} />} disabled={selectedRowKeys.length === 0} onClick={exportExcel}>
					Xuất Excel{selectedRowKeys.length ? ` (${selectedRowKeys.length})` : ''}
				</Button>
			</div>
			<Space wrap className="mb-4">
				<Input value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} placeholder="Tìm mã BH..." prefix={<Search size={16} />} className="w-[260px]" />
				<DatePicker.RangePicker onChange={(values) => { setRange([values?.[0]?.format('YYYY-MM-DD'), values?.[1]?.format('YYYY-MM-DD')]); setPage(1); }} />
			</Space>
			{legacyRows.length > 0 && (
				<div className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm">
					<div className="mb-2 font-medium">{legacyRows.length} đơn đã xuất MISA cũ cần xác nhận mã</div>
					<Space wrap>
						<Button type="primary" size="small" onClick={confirmAllLegacy}>Xác nhận tất cả theo mã gợi ý</Button>
						{legacyRows.slice(0, 10).map((item) => <Button key={item.id} size="small" onClick={() => openLegacy(item)}>#{item.display_id}</Button>)}
					</Space>
				</div>
			)}
			<Table
				loading={query.isLoading || query.isFetching}
				columns={columns as any}
				dataSource={report?.operations ?? []}
				rowKey="id"
				rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
				scroll={{ x: 1000 }}
				pagination={{ total: report?.count ?? 0, pageSize: 50, current: page, onChange: (nextPage) => { setPage(nextPage); setSelectedRowKeys([]); } }}
			/>
			<Modal title="Xác nhận đơn MISA cũ" open={Boolean(legacy)} onCancel={() => setLegacy(null)} onOk={confirmLegacy} okText="Xác nhận" cancelText="Hủy">
				<Form form={legacyForm} layout="vertical">
					<Form.Item name="misa_document_number" label="Số chứng từ BH" rules={[{ required: true }]}><Input /></Form.Item>
					<Form.Item name="misa_stock_out_number" label="Số phiếu xuất XK" rules={[{ required: true }]}><Input /></Form.Item>
					<Form.Item name="misa_first_exported_at" label="Ngày xuất MISA đầu tiên" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
				</Form>
			</Modal>
		</Card>
	);
}
