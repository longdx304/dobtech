import React from 'react'
import { Metadata } from 'next';
import { Empty } from '@/components/Empty';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard',
};

export default function DashboardPage() {
	return <Empty description={false} className="pt-20" />;
}
