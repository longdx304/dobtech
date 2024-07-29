/* eslint-disable jsx-a11y/alt-text */
'use client';
import { Skeleton } from 'antd';
import { Image } from 'lucide-react';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';

const OrderSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-12">
			<div className="pt-4 container box-border grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-x-8">
				<Card className="">
					<div className="flex gap-4 w-full h-full items-center">
						<Skeleton.Image active className="" />
						<Skeleton active paragraph={{ rows: 4 }} />
					</div>
				</Card>
				<Card className="">
					<Skeleton active paragraph={{ rows: 4 }} />
				</Card>
			</div>
		</div>
	);
};

export default OrderSkeleton;

// const ProductsSkeleton = () => {
// 	return (
// 		<Flex
// 			vertical
// 			className="shadow group rounded lg:hover:shadow-lg transition-all cursor-pointer pb-4"
// 		>
// 			<div className="w-full h-auto aspect-[1/1]">
// 				<Skeleton.Node active className="w-full h-full">
// 					<Image size={40} style={{ color: '#bfbfbf' }} />
// 				</Skeleton.Node>
// 			</div>
// 			<Skeleton active paragraph={{ rows: 1 }} className="px-4" />
// 		</Flex>
// 	);
// };
