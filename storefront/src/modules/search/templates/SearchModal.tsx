"use client";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input, Divider } from "antd";
import { useRouter } from "next/navigation";

import { Flex } from "@/components/Flex";
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products";
import SuggestSearch from "@/modules/search/components/suggest-search";
import RecentSearch from "@/modules/search/components/recent-search";

const { Search } = Input;

type SearchModalProps = {};

export default function SearchModal({}: SearchModalProps) {
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const router = useRouter();

	const onSearch = (value: string) => {
		router.push(`/search/${value}`);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;

			// Update search
			setSearchValue(inputValue);
		},
		500
	);

	return (
		<>
			<Flex
				className="pt-4 px-4"
				justify="center"
				align="center"
				gap="small"
			>
				<ChevronLeft
					size={24}
					onClick={() => router.back()}
					className="cursor-pointer"
				/>
				<Search
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
