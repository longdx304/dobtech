"use client";

import { FC, Fragment, useMemo, useState } from "react";

import { Dropdown } from "@/components/Dropdown";
import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import { cn } from "@/lib/utils";
import { TTreeCategories } from "@/types/productCategory";
import { usePathname } from 'next/navigation';
import CategoryMenu from '../category-menu';
import LocalizedClientLink from "../localized-client-link";

interface Props {
	categories: TTreeCategories[] | null;
}

const Category: FC<Props> = ({ categories }) => {
	const pathname = usePathname();
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	const handleMouseEnter = (categoryId: string) => {
		setHoveredItem(categoryId); // Set state khi hover vào item
	};

	const dropdownRender = useMemo(() => {
		return (
			<CategoryMenu
				categories={categories}
				activeItem={hoveredItem!}
				handleMouseEnter={handleMouseEnter}
			/>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hoveredItem]);

	return (
		<Fragment>
			<Dropdown
				overlayStyle={{ width: "100%", left: "0px" }}
				className="category hidden lg:block pb-1"
				dropdownRender={(menu) => dropdownRender}
			>
				<Flex>
					{categories?.map((category) => (
						<Text
							className={cn(
								"text-[13px] text-[#666666] text font-normal cursor-pointer hover:bg-slate-100 rounded-t-[6px] py-2 px-2"
							)}
							key={category.id}
							onMouseEnter={() => handleMouseEnter(category.id)}
						>
								{category.label}
						</Text>
					))}
				</Flex>
			</Dropdown>
			<Flex className="block lg:hidden py-1">
				<Text
					className={cn(
						"text-[13px] text-[#666666] text font-normal cursor-pointer py-2 px-2",
						pathname === '/' && 'font-bold'
					)}
				>
					<LocalizedClientLink
						href={`/`}
						className="text-[#666666]"
					>
						{'Tất cả'}
					</LocalizedClientLink>
				</Text>
				{categories?.map((category) => (
					<Text
						className={cn(
							"text-[13px] text-[#666666] text font-normal cursor-pointer py-2 px-2",
							pathname.replace('/categories/', '') === category.key && 'font-bold'
						)}
						key={category.id}
					>
						<LocalizedClientLink
							href={`categories/${category.key}`}
							className="text-[#666666]"
						>
							{category.label}
						</LocalizedClientLink>
					</Text>
				))}
			</Flex>
		</Fragment>
	);
};

export default Category;