'use client';

import { Dropdown } from '@/components/Dropdown';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import RecentSearch from '@/modules/search/components/recent-search';
import SuggestSearch from '@/modules/search/components/suggest-search';
import { Input, Menu } from 'antd';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

const { Search } = Input;

const SearchInput = () => {
  const { setItem, getItem } = useLocalStorage('recentSearches');
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

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

  const handleChangeDebounce = _.debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;

      // Update search
      setSearchValue(inputValue);
      setIsDropdownOpen(true);
    },
    500
  );

  const dropdownContent = (
    <Menu style={{ padding: '24px' }}>
      {searchValue ? (
        <SuggestSearch searchValue={searchValue} />
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
      placement='bottomCenter'
    >
      <Search
        className='[&_.ant-input-outlined:focus]:shadow-none max-w-[300px]'
        placeholder='Tìm kiếm'
        onSearch={onSearch}
        onChange={handleChangeDebounce}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setIsDropdownOpen(false)}
        enterButton
      />
    </Dropdown>
  );
};

export default SearchInput;
