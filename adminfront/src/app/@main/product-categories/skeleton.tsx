import { Skeleton } from '@/components/Skeleton';

const LoadingSkeleton = () => {
	return (
		<Skeleton
			className="bg-white shadow-lg p-4 sm:rounded-md"
			paragraph={{ rows: 4 }}
		/>
	);
};

export default LoadingSkeleton;
