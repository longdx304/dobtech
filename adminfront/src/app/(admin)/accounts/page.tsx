import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import AccountList from '@/modules/account/components/account-list';
import AccountSearch from '@/modules/account/components/account-search';

export const metadata: Metadata = {
	title: 'Quản lý nhân viên',
	description: 'Trang quản lý nhân viên',
};

interface Props {
	searchParams: Record<string, unknown>;
}

export default function Accounts({ searchParams }: Props) {

	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<AccountList />
		</Flex>
	);
}
