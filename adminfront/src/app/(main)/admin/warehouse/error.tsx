'use client';

import RouteErrorState from '@/modules/admin/common/components/route-error-state';

type WarehouseErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function WarehouseError({
	error,
	reset,
}: WarehouseErrorProps) {
	return (
		<RouteErrorState
			error={error}
			reset={reset}
			title="Không thể hiển thị dữ liệu kho"
			description="Dữ liệu kho chưa đầy đủ hoặc trang vừa gặp lỗi tạm thời. Vui lòng thử tải lại."
			logContext="Warehouse route render error"
		/>
	);
}
