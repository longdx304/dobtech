'use client';
import { Skeleton } from 'antd';
import { Image } from 'lucide-react';
import { Flex } from '@/components/Flex';

export default function HomepageSkeleton() {
	const skeletonArray = Array.from({ length: 24 });
	return (
		<main className="w-full pb-20">
			<h2 className="flex justify-center items-center">Sản phẩm mới</h2>
			<div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4">
				{skeletonArray.map((_, index) => (
					<ProductsSkeleton key={index} />
				))}
			</div>
		</main>
	);
}

const ProductsSkeleton = () => {
	return (
		<Flex
			vertical
			className="shadow group rounded lg:hover:shadow-lg transition-all cursor-pointer pb-4"
		>
			<div className="w-full h-auto aspect-[1/1]">
				<Skeleton.Node active className="w-full h-full">
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<Image size={40} style={{ color: '#bfbfbf' }} />
				</Skeleton.Node>
			</div>
			<Skeleton active paragraph={{ rows: 1 }} className="px-4" />
		</Flex>
	);
};
