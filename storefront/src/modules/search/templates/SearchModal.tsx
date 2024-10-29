'use client';
import { Divider } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { Flex } from '@/components/Flex';
import SearchInput from '@/components/Input/SearchInput';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import RecentSearch from '@/modules/search/components/recent-search';
import SuggestSearch from '@/modules/search/components/suggest-search';
import { debounce } from 'lodash-es';

type SearchModalProps = {};

export default function SearchModal({}: SearchModalProps) {
	const { setItem, getItem } = useLocalStorage('recentSearches');
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const router = useRouter();

	const onSearch = (value: string) => {
		const recentSearches = getItem();
		if (recentSearches && !recentSearches.includes(value)) {
			const newRecentSearches = [...recentSearches, value];
			setItem(newRecentSearches);
		} else {
			setItem([value]);
		}
		router.push(`/search/keyword=${value}`);
	};

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;

		// Update search
		setSearchValue(inputValue);
	}, 500);

	return (
		<>
			<Flex className="pt-4 px-4" justify="center" align="center" gap="small">
				<ChevronLeft
					size={24}
					onClick={() => router.back()}
					className="cursor-pointer"
				/>
				<SearchInput
					className="[&_.ant-input-outlined:focus]:shadow-none"
					placeholder="Tìm kiếm"
					onSearch={onSearch}
					onChange={handleChangeDebounce}
					enterButton
				/>
			</Flex>
			<Divider className="my-3" />
			{searchValue && <SuggestSearch searchValue={searchValue} />}
			{!searchValue && <RecentSearch />}
		</>
	);
}
