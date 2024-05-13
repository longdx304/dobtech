'use client';
import { ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import _ from 'lodash';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/Button';
import { updateSearchQuery } from '@/lib/utils';
import useAdminAction from '@/lib/hooks/useAdminAction';

interface Props {}

const AccountSearch = ({}: Props) => {
	const { setQuery } = useAdminAction();

	// Function use debounce for onChange input
	const handleChangeDebounce = 
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;

			console.log('inputValue', inputValue)
			// Update search query
			setQuery(inputValue);
		}
	// const handleChangeDebounce = _.debounce(
	// 	(e: ChangeEvent<HTMLInputElement>) => {
	// 		const { value: inputValue } = e.target;

	// 		console.log('inputValue', inputValue)
	// 		// Update search query
	// 		setQuery(inputValue);
	// 	},
	// 	750
	// );

	return (
		<Card className="w-full space-y-4" rounded={false}>
			<Flex vertical gap="small" className="w-full">
				{/* Title */}
				<Title level={5}>Tìm kiếm nhân viên</Title>
				{/* Search */}
				<Flex gap="small" className="w-full">
					<Input
						placeholder="Tìm kiếm nhân viên..."
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
