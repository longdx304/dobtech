'use client';

import RouteErrorState from '@/modules/admin/common/components/route-error-state';

type WarehouseManageErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function WarehouseManageError({
	error,
	reset,
}: WarehouseManageErrorProps) {
	return (
		<RouteErrorState
			error={error}
			reset={reset}
			title="Không thể hiển thị dữ liệu kho"
			description="Một bản ghi kho có dữ liệu chưa hợp lệ hoặc trang vừa gặp lỗi tạm thời. Vui lòng thử tải lại dữ liệu."
			logContext="Warehouse manage render error"
		/>
	);
}
