'use client';
import { Flex } from '@/components/Flex';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import _ from 'lodash';
import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { type TabsProps } from 'antd';
import OrderList from './orders';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const ManageOrders: FC<Props> = ({}) => {

	const itemsTab: TabsProps['items'] = [
		{
			key: 'orders',
			label: 'Đơn hàng',
			children: <OrderList />,
		},
		{
			key: 'drafts',
			label: 'Drafts',
			// children: <CollectionList />,
		},
	];

	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemsTab} />
		</Card>
	);
};

export default ManageOrders;
