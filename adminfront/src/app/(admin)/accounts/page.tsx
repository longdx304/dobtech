import { Metadata } from 'next';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { listUser } from '@/actions/accounts';
import { Flex } from '@/components/Flex';
import AccountList from '@/modules/account/components/account-list';
import AccountSearch from '@/modules/account/components/account-search';
import Await from './await';
import LoadingSkeleton from './skeleton';

export const metadata: Metadata = {
	title: 'Quản lý nhân viên',
	description: 'Trang quản lý nhân viên',
};

interface Props {
	searchParams: Record<string, unknown>;
}

export default async function Accounts({ searchParams }: Props) {
	const users = await listUser(searchParams);

	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<AccountSearch />
			{/* <Suspense key={uuidv4()} fallback={<LoadingSkeleton />}>
				<Await promise={Promise.resolve(users)}>
					{(users) => <AccountList data={users} />}
				</Await>
			</Suspense> */}
			<AccountList />
		</Flex>
	);
}
