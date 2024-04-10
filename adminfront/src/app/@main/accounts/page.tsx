import { Metadata } from 'next';

import AccountSearch from '@/modules/account/components/account-search';
import AccountList from '@/modules/account/components/account-list';
import { Flex } from '@/components/Flex';

export const metadata: Metadata = {
	title: 'Manage Accounts',
	description: 'Account Page',
};

export default function Accounts() {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<AccountSearch />
			<AccountList />
		</Flex>
	);
}
