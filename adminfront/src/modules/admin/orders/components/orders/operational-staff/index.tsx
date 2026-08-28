'use client';

import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { Title } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Order } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { useAdminUsers, useMedusa } from 'medusa-react';
import { useEffect, useMemo, useState } from 'react';

type Assignment = {
	id: string;
	user_id: string;
	role: 'preparer' | 'checker';
	user?: { first_name?: string | null; last_name?: string | null; email: string };
};

type Props = { order: Order; refetch: () => void };

export default function OperationalStaff({ order, refetch }: Props) {
	const { user: currentUser } = useUser();
	const { client } = useMedusa();
	const isManager = currentUser?.role === 'admin' ||
		String((currentUser as any)?.permissions ?? '').split(',').map((value) => value.trim()).includes('manager');
	const { users } = useAdminUsers({ limit: 100 });
	const { data, refetch: refetchAssignments, isLoading } = useQuery({
		queryKey: ['order-operational-staff', order.id],
		queryFn: () => client.admin.custom.get(`/admin/management/orders/${order.id}/operational-staff`),
		enabled: isManager,
	});
	const assignments = useMemo(
		() => (data?.assignments ?? data?.data?.assignments ?? []) as Assignment[],
		[data]
	);
	const [preparerIds, setPreparerIds] = useState<string[]>([]);
	const [checkerIds, setCheckerIds] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setPreparerIds(assignments.filter((item) => item.role === 'preparer').map((item) => item.user_id));
		setCheckerIds(assignments.filter((item) => item.role === 'checker').map((item) => item.user_id));
	}, [assignments]);

	const options = useMemo(() => (users ?? [])
		.filter((staff: any) => !staff.deleted_at)
		.map((staff: any) => ({
			value: staff.id,
			label: [staff.last_name, staff.first_name].filter(Boolean).join(' ') || staff.email,
		})), [users]);

	if (!isManager) return null;

	const save = async () => {
		setSaving(true);
		try {
			await client.admin.custom.post(`/admin/management/orders/${order.id}/operational-staff`, {
				preparer_ids: preparerIds,
				checker_ids: checkerIds,
			});
			message.success('Đã cập nhật nhân sự vận hành');
			await Promise.all([refetchAssignments(), Promise.resolve(refetch())]);
		} catch (error: any) {
			message.error(error?.response?.data?.message || 'Không thể cập nhật nhân sự vận hành');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card className="px-4">
			<Title level={4}>Nhân sự vận hành</Title>
			<div className="mt-4 grid gap-4">
				<div>
					<div className="mb-2 text-xs text-gray-500">Người soạn</div>
					<Select mode="multiple" loading={isLoading} value={preparerIds} onChange={setPreparerIds} options={options} placeholder="Chọn người soạn" className="w-full" />
				</div>
				<div>
					<div className="mb-2 text-xs text-gray-500">Người kiểm</div>
					<Select mode="multiple" loading={isLoading} value={checkerIds} onChange={setCheckerIds} options={options} placeholder="Chọn người kiểm" className="w-full" />
				</div>
				<div><Button type="primary" loading={saving} onClick={save}>Lưu nhân sự</Button></div>
			</div>
		</Card>
	);
}
