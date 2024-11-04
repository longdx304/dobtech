import { Spin } from 'antd';

export default function Loading() {
	return (
		<div className="w-full min-h-[400px] flex items-center justify-center">
			<Spin size="large" />
		</div>
	);
}
