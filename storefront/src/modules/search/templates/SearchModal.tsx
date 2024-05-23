"use client";
import { ChevronLeft } from "lucide-react";

import { Flex } from "@/components/Flex";
import { Input } from "antd";
import { useRouter } from "next/navigation";

const { Search } = Input;

export default function SearchModal() {
	const router = useRouter();

	const onSearch = (value: string) => {
		console.log(value);
		router.push(`/search/${value}`);
	};

	return (
		<Flex className="pt-4 px-4" justify="center" align="center" gap="small">
			<ChevronLeft size={24} onClick={() => router.back()} />
			<Search
				className="[&_.ant-input-outlined:focus]:shadow-none"
				placeholder="Tìm kiếm"
				onSearch={onSearch}
				enterButton
			/>
		</Flex>
	);
}
