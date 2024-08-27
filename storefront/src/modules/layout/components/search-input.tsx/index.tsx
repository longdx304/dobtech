'use client';

import { Dropdown } from '@/components/Dropdown';
import SearchInput from '@/components/Input/SearchInput';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import RecentSearch from '@/modules/search/components/recent-search';
import SuggestSearch from '@/modules/search/components/suggest-search';
import { Menu } from 'antd';
import { debounce } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';

const SearchProduct = () => {
	const { setItem, getItem } = useLocalStorage('recentSearches');
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const router = useRouter();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const onSearch = (value: string) => {
		const recentSearches = getItem();

		if (recentSearches && !recentSearches.includes(value)) {
			const newRecentSearches = [...recentSearches, value];
			setItem(newRecentSearches);
		} else {
			setItem([value]);
		}

		router.push(`/search/${value}`);
	};

	const handleBlur = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setIsDropdownOpen(false);
		}, 200);
	};

	const handleDropdownClick = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsDropdownOpen(false);
	};

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;

		// Update search
		setSearchValue(inputValue);
		setIsDropdownOpen(true);
	}, 500);

	const dropdownContent = (
		<Menu style={{ padding: '24px' }}>
			{searchValue ? (
				<SuggestSearch
					searchValue={searchValue}
					onClick={handleDropdownClick}
				/>
			) : (
				<RecentSearch />
			)}
		</Menu>
	);

	return (
		<Dropdown
			dropdownRender={() => dropdownContent}
			trigger={['click']}
			open={isDropdownOpen}
			placement="bottom"
			onOpenChange={handleDropdownClick}
		>
			<SearchInput
				className="[&_.ant-input-outlined:focus]:shadow-none max-w-[300px]"
				placeholder="Tìm kiếm"
				onSearch={onSearch}
				onChange={handleChangeDebounce}
				onFocus={() => setIsDropdownOpen(true)}
				onBlur={handleBlur}
				onClick={() => setIsDropdownOpen(true)}
				enterButton
			/>
		</Dropdown>
	);
};

export default SearchProduct;
