import { Metadata } from 'next';
import { User } from '@medusajs/medusa';
import { cache } from 'react';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import AccountSearch from '@/modules/account/components/account-search';
import AccountList from '@/modules/account/components/account-list';
import { Flex } from '@/components/Flex';
import { listUser } from '@/actions/accounts';
import Await from './await';
import LoadingSkeleton from './skeleton';

export const metadata: Metadata = {
	title: 'Manage Accounts',
	description: 'Account Page',
};

interface Props {
	searchParams: Record<string, unknown>;
}

// const fetchUser = cache(
// 	async () => await listUser().catch((error: any) => null)
// );
export default async function Accounts({ searchParams }: Props) {
	const users = await listUser(searchParams);
	// const users = await listUser(searchParams).catch((error: any) => null);

	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<AccountSearch />
			<Suspense key={uuidv4()} fallback={<LoadingSkeleton />}>
				<Await promise={users}>{(users) => <AccountList data={users} />}</Await>
			</Suspense>
		</Flex>
	);
}
