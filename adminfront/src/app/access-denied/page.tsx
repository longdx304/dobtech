export default function AccessDeniedPage() {
	return (
		<main className="min-h-screen flex items-center justify-center px-4">
			<div className="max-w-lg text-center">
				<h1 className="text-2xl font-semibold">Bạn chưa được cấp quyền truy cập</h1>
				<p className="mt-3 text-gray-500">
					Vui lòng liên hệ quản trị viên để được cấp quyền phù hợp.
				</p>
			</div>
		</main>
	);
}
