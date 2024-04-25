'use client';
import _ from 'lodash';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { updateSearchQuery } from '@/lib/utils';

interface Props {}

const AccountSearch = ({}: Props) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { replace } = useRouter();

	// Function handle change input
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		console.log('e', value);
	};

	// Function use debounce for onChange input
	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			// create new search params with new value
			const newSearchParams = updateSearchQuery(searchParams, {
				q: inputValue,
				page: '1',
			});

			// Replace url
			replace(`${pathname}?${newSearchParams}`);
		},
		750
	);

	return (
		<Card className="w-full space-y-4" bordered={false}>
			<Flex vertical gap="small" className="w-full">
				{/* Title */}
				<Title level={5}>Tìm kiếm nhân viên</Title>
				{/* Search */}
				<Flex gap="small" className="w-full">
					<Input
						name="search"
						prefix={<Search />}
						onChange={handleChangeDebounce}
					/>
				</Flex>
				{/* Filter & Sort */}
			</Flex>
		</Card>
	);
};

export default AccountSearch;
