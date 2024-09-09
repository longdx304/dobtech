'use client';

import { Card } from '@/components/Card';
import { FC } from 'react';
import SupplierList from './supplier/supplier-list';

type Props = {};

const ManageSupplier: FC<Props> = ({}) => {
	return (
		<Card className="w-full" bordered={false}>
			<SupplierList />
		</Card>
	);
};

export default ManageSupplier;
