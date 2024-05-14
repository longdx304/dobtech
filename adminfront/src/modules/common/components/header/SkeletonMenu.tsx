import {FC} from 'react';
import { Skeleton } from 'antd';

import { Flex } from '@/components/Flex';

type Props = {
	isLoading: boolean;
}

const SkeletonMenu = ({ isLoading }) => {
	return (
		<Flex vertical gap="small" className="px-4 pt-4" >
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
			<Skeleton.Input loading={isLoading} block={true} active />
		</Flex>
	);
}

export default SkeletonMenu;