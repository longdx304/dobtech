'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
	AccessPermission,
	resolvePagePermissions,
} from '@/lib/access-control';
import { useUser } from '@/lib/providers/user-provider';
import { ERoutes } from '@/types/routes';
import { useQuery } from '@tanstack/react-query';
import {
	ArrowUpRight,
	ClipboardCheck,
	ClipboardList,
	PackageMinus,
	RefreshCw,
	Truck,
} from 'lucide-react';
import { useMedusa } from 'medusa-react';
import Link from 'next/link';
import { useMemo } from 'react';

type DashboardData = {
	summary: {
		orders_today: number;
		awaiting_pick: number;
		awaiting_check: number;
		delivering: number;
		shipped_today: number;
	};
	operational_orders: Array<{
		id: string;
		display_id: number;
		customer_name: string;
		created_at: string;
		stage: 'picking' | 'checking';
	}>;
	generated_at: string;
};

const vietnamTime = new Intl.DateTimeFormat('vi-VN', {
	dateStyle: 'medium',
	timeStyle: 'short',
	timeZone: 'Asia/Ho_Chi_Minh',
});

const createdTime = new Intl.DateTimeFormat('vi-VN', {
	hour: '2-digit',
	minute: '2-digit',
	day: '2-digit',
	month: '2-digit',
	timeZone: 'Asia/Ho_Chi_Minh',
});

const quickLinks = [
	{
		permission: AccessPermission.SalesOrders,
		href: ERoutes.ORDERS,
		label: 'Đơn hàng',
		description: 'Theo dõi và xử lý đơn bán',
		icon: ClipboardList,
	},
	{
		permission: AccessPermission.WarehouseOutbound,
		href: ERoutes.WAREHOUSE_OUTBOUND,
		label: 'Xuất kho',
		description: 'Phân công đơn cần soạn',
		icon: PackageMinus,
	},
	{
		permission: AccessPermission.WarehouseStockChecker,
		href: ERoutes.WAREHOUSE_STOCK_CHECKER,
		label: 'Kiểm hàng',
		description: 'Kiểm tra đơn đã soạn',
		icon: ClipboardCheck,
	},
	{
		permission: AccessPermission.WarehouseShipment,
		href: ERoutes.WAREHOUSE_SHIPMENT,
		label: 'Vận chuyển',
		description: 'Điều phối giao hàng',
		icon: Truck,
	},
	{
		permission: AccessPermission.ManagementOperationsReport,
		href: ERoutes.OPERATIONS_REPORT,
		label: 'Báo cáo vận hành',
		description: 'Theo dõi đơn đã xuất MISA',
		icon: ArrowUpRight,
	},
];

export default function DashboardTemplate() {
	const { client } = useMedusa();
	const { user } = useUser();
	const dashboardQuery = useQuery({
		queryKey: ['admin-dashboard-overview'],
		queryFn: () => client.admin.custom.get('/admin/dashboard/overview'),
		refetchInterval: 60_000,
	});
	const dashboard = dashboardQuery.data as DashboardData | undefined;
	const summary = dashboard?.summary;
	const allowedPermissions = useMemo(
		() =>
			user?.role === 'admin'
				? new Set(Object.values(AccessPermission))
				: new Set(resolvePagePermissions(user as any)),
		[user]
	);
	const visibleQuickLinks = quickLinks.filter(({ permission }) =>
		allowedPermissions.has(permission)
	);
	const greetingName = [user?.last_name, user?.first_name]
		.filter(Boolean)
		.join(' ');

	const indicators = [
		{
			label: 'Đơn mới hôm nay',
			value: summary?.orders_today ?? 0,
			description: 'Đơn được tạo từ 00:00 đến hiện tại',
			className: 'border-blue-100 bg-blue-50 text-blue-700',
		},
		{
			label: 'Chờ soạn',
			value: summary?.awaiting_pick ?? 0,
			description: 'Đơn chưa hoàn tất khâu xuất kho',
			className: 'border-amber-100 bg-amber-50 text-amber-700',
		},
		{
			label: 'Chờ kiểm',
			value: summary?.awaiting_check ?? 0,
			description: 'Đơn đã có người soạn, chưa kiểm',
			className: 'border-violet-100 bg-violet-50 text-violet-700',
		},
		{
			label: 'Đang giao',
			value: summary?.delivering ?? 0,
			description: 'Đơn đã tạo phiếu giao, chưa hoàn tất',
			className: 'border-cyan-100 bg-cyan-50 text-cyan-700',
		},
		{
			label: 'Đã giao hôm nay',
			value: summary?.shipped_today ?? 0,
			description: 'Đơn được xác nhận giao trong hôm nay',
			className: 'border-emerald-100 bg-emerald-50 text-emerald-700',
		},
	];

	return (
		<div className="w-full space-y-5">
			<section className="rounded-2xl bg-slate-950 px-6 py-6 text-white shadow-lg sm:px-8">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="mb-2 text-sm font-medium text-slate-300">TRUNG TÂM VẬN HÀNH</p>
						<h1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">
							{greetingName ? `Chào ${greetingName}` : 'Tổng quan vận hành kho'}
						</h1>
						<p className="mb-0 mt-2 max-w-2xl text-sm text-slate-300">
							Theo dõi đơn hàng, xuất kho, kiểm hàng và giao nhận trong một màn hình.
						</p>
					</div>
					<Button
						type="default"
						icon={<RefreshCw size={16} className={dashboardQuery.isFetching ? 'animate-spin' : ''} />}
						onClick={() => dashboardQuery.refetch()}
						loading={dashboardQuery.isFetching}
					>
						Làm mới
					</Button>
				</div>
				<p className="mb-0 mt-5 text-xs text-slate-400">
					Dữ liệu tính theo giờ Việt Nam
					{dashboard?.generated_at ? ` · Cập nhật ${vietnamTime.format(new Date(dashboard.generated_at))}` : ''}
				</p>
			</section>

			{dashboardQuery.isError && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					Không thể tải số liệu vận hành. Vui lòng thử làm mới lại.
				</div>
			)}

			<section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
				{indicators.map((indicator) => (
					<Card key={indicator.label} loading={dashboardQuery.isLoading} className="h-full border border-slate-100 shadow-sm">
						<p className="mb-3 text-sm font-medium text-slate-600">{indicator.label}</p>
						<p className={`mb-2 inline-flex rounded-lg px-3 py-1 text-3xl font-semibold ${indicator.className}`}>
							{indicator.value.toLocaleString('vi-VN')}
						</p>
						<p className="mb-0 text-xs leading-5 text-slate-500">{indicator.description}</p>
					</Card>
				))}
			</section>

			<section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
				<Card className="xl:col-span-2 border border-slate-100 shadow-sm" loading={dashboardQuery.isLoading}>
					<div className="mb-4 flex items-center justify-between gap-3">
						<div>
							<h2 className="m-0 text-lg font-semibold text-slate-900">Hàng đợi vận hành</h2>
							<p className="mb-0 mt-1 text-sm text-slate-500">Các đơn mới nhất đang chờ soạn hoặc kiểm.</p>
						</div>
						{allowedPermissions.has(AccessPermission.SalesOrders) && (
							<Link href={ERoutes.ORDERS} className="whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700">
								Xem tất cả
							</Link>
						)}
					</div>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[560px] text-left text-sm">
							<thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
								<tr>
									<th className="pb-3 font-medium">Đơn hàng</th>
									<th className="pb-3 font-medium">Khách hàng</th>
									<th className="pb-3 font-medium">Công đoạn</th>
									<th className="pb-3 font-medium">Tạo lúc</th>
									<th className="pb-3 text-right font-medium"></th>
								</tr>
							</thead>
							<tbody>
								{(dashboard?.operational_orders ?? []).map((order) => (
									<tr key={order.id} className="border-b border-slate-50 last:border-0">
										<td className="py-3 font-semibold text-slate-800">#{order.display_id}</td>
										<td className="max-w-[220px] truncate py-3 text-slate-600">{order.customer_name}</td>
										<td className="py-3">
											<span className={order.stage === 'checking' ? 'rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700' : 'rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700'}>
												{order.stage === 'checking' ? 'Chờ kiểm' : 'Chờ soạn'}
											</span>
										</td>
										<td className="py-3 text-slate-500">{createdTime.format(new Date(order.created_at))}</td>
										<td className="py-3 text-right">
											{allowedPermissions.has(AccessPermission.SalesOrders) && (
												<Link href={`${ERoutes.ORDERS}/${order.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">Mở đơn</Link>
											)}
										</td>
									</tr>
								))}
								{!dashboardQuery.isLoading && (dashboard?.operational_orders ?? []).length === 0 && (
									<tr><td colSpan={5} className="py-10 text-center text-sm text-slate-500">Không có đơn nào đang chờ xử lý.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</Card>

				<Card className="border border-slate-100 shadow-sm">
					<h2 className="m-0 text-lg font-semibold text-slate-900">Truy cập nhanh</h2>
					<p className="mb-4 mt-1 text-sm text-slate-500">Đi tới đúng công đoạn ngay khi cần xử lý.</p>
					<div className="space-y-2">
						{visibleQuickLinks.map(({ href, label, description, icon: Icon }) => (
							<Link key={href} href={href} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50">
								<span className="rounded-lg bg-slate-100 p-2 text-slate-700 group-hover:bg-white group-hover:text-blue-600"><Icon size={18} /></span>
								<span className="min-w-0 flex-1"><span className="block text-sm font-medium text-slate-800">{label}</span><span className="block truncate text-xs text-slate-500">{description}</span></span>
								<ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
							</Link>
						))}
					</div>
				</Card>
			</section>
		</div>
	);
}
