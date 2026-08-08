'use client';

import RouteErrorState from '@/modules/admin/common/components/route-error-state';

type DraftOrdersErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function DraftOrdersError({
	error,
	reset,
}: DraftOrdersErrorProps) {
	return (
		<RouteErrorState
			error={error}
			reset={reset}
			title="Không thể hiển thị đơn nháp"
			description="Dữ liệu đơn nháp chưa đầy đủ hoặc trang vừa gặp lỗi tạm thời. Vui lòng thử tải lại."
			logContext="Draft orders route render error"
		/>
	);
}
