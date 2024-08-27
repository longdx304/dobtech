/* eslint-disable jsx-a11y/alt-text */
'use client';
import { Card } from '@/components/Card';
import { Skeleton } from 'antd';

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
