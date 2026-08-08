'use client';

import RouteErrorState from '@/modules/admin/common/components/route-error-state';

type OrdersErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function OrdersError({ error, reset }: OrdersErrorProps) {
	return (
		<RouteErrorState
			error={error}
			reset={reset}
			title="Không thể hiển thị đơn hàng"
			description="Dữ liệu đơn hàng chưa đầy đủ hoặc trang vừa gặp lỗi tạm thời. Vui lòng thử tải lại."
			logContext="Orders route render error"
		/>
	);
}
