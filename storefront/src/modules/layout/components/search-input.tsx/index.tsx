'use client';

import { Dropdown } from '@/components/Dropdown';
import SearchInput from '@/components/Input/SearchInput';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import RecentSearch from '@/modules/search/components/recent-search';
import SuggestSearch from '@/modules/search/components/suggest-search';
import { Menu, Spin } from 'antd';
import { debounce } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';

const SearchProduct = () => {
	const { setItem, getItem } = useLocalStorage('recentSearches');
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const onSearch = async (value: string) => {
		setIsDropdownOpen(false);
		setIsLoading(true);

		// blur input
		inputRef.current?.blur();

		const recentSearches = getItem();

		if (recentSearches && !recentSearches.includes(value)) {
			const newRecentSearches = [...recentSearches, value];
			setItem(newRecentSearches);
		} else {
			setItem([value]);
		}

		try {
			router.push(`/search/keyword=${value}`);
		} finally {
			setIsLoading(false);
		}
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
		inputRef.current?.blur();
	};

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);

		if (inputValue.trim()) {
			setIsDropdownOpen(true);
		} else {
			setIsDropdownOpen(false);
		}
	}, 500);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsDropdownOpen(false);
			inputRef.current?.blur();
		}
	};

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
		<div className="relative">
			<Dropdown
				dropdownRender={() => dropdownContent}
				trigger={['click']}
				open={isDropdownOpen}
				placement="bottom"
				onOpenChange={handleDropdownClick}
			>
				<SearchInput
					ref={inputRef}
					className="[&_.ant-input-outlined:focus]:shadow-none max-w-[300px]"
					placeholder="Tìm kiếm"
					onSearch={onSearch}
					onChange={handleChangeDebounce}
					onFocus={() => setIsDropdownOpen(true)}
					onBlur={handleBlur}
					onClick={() => setIsDropdownOpen(true)}
					onKeyDown={handleKeyDown}
					enterButton
					disabled={isLoading}
				/>
			</Dropdown>
			{isLoading && (
				<div className="absolute right-12 top-1/2 -translate-y-1/2">
					<Spin size="small" />
				</div>
			)}
		</div>
	);
};

export default SearchProduct;
