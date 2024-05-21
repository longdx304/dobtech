"use client";

import { Avatar, Col, Row } from "antd";
import { ChevronRight } from "lucide-react";
import React, { FC, useMemo, useState, Fragment } from "react";

import { Dropdown } from "@/components/Dropdown";
import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import { cn } from "@/lib/utils";
import { TTreeCategories } from "@/types/productCategory";
import LocalizedClientLink from "../localized-client-link";
import { usePathname } from 'next/navigation';

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
			<div className="w-full bg-slate-50 shadow-xl py-4">
				<div className="container">
					<Row className="" gutter={[16, 0]}>
						<Col span={5}>
							<CategoryNav
								categories={categories}
								activeItem={hoveredItem!}
								handleMouseEnter={handleMouseEnter}
							/>
						</Col>
						<Col span={19} className="border-l border-slate-200/80">
							<CategoryGroup
								categories={categories!}
								hoveredItem={hoveredItem}
							/>
						</Col>
					</Row>
				</div>
			</div>
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

const CategoryNav = ({
	categories,
	activeItem,
	handleMouseEnter,
}: {
	categories: TTreeCategories[] | null;
	activeItem: string;
	handleMouseEnter: (categoryId: string) => void;
}) => {
	return (
		<Flex vertical className="w-full">
			{categories?.map((category) => (
				<LocalizedClientLink href={`categories/${category.key}`} key={category.id}>
				<Flex
					onMouseEnter={() => handleMouseEnter(category.id)}
					justify="space-between"
					align="items-center"
					className={cn(
						"group w-full cursor-pointer hover:bg-slate-200/30 rounded-[8px] py-2 px-2 box-border transition-all",
						activeItem === category.id && "bg-slate-200/30"
					)}
					
				>
						<Text className="text-[12px] text-[#666666] font-normal">
							{category.label}
						</Text>
					<ChevronRight
						className={cn(
							"group-hover:translate-x-1",
							activeItem === category.id && "translate-x-1"
						)}
						color="#767676"
						size={20}
						/>
				</Flex>
					</LocalizedClientLink>
			))}
		</Flex>
	);
};

const CategoryGroup = ({
	categories,
	hoveredItem,
}: {
	categories: TTreeCategories[] | null;
	hoveredItem: string | null;
}) => {
	const formattedText = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	};

	const url = "https://ananas.vn/wp-content/uploads/Pro_AV00205_1.jpeg";

	return (
		<Flex gap="middle" className="w-full">
			{categories?.map(
				(category) =>
					category.id === hoveredItem &&
					category.children &&
					category.children.length > 0 && (
						<React.Fragment key={category.id}>
							{category.children.map((child) => (
								<Flex
									key={child.id}
									vertical
									gap="small"
									align="center"
									className="cursor-pointer"
								>
									<LocalizedClientLink
										href={`categories/${child.key}`}
									>
										<div className="flex items-center flex-col gap-1">
											<Avatar size={64} src={url}>
												{child.label
													.toUpperCase()
													.substring(0, 2)}
											</Avatar>
											<span className="text-[#666666] text-[11px]">
												{formattedText(child.label)}
											</span>
										</div>
									</LocalizedClientLink>
								</Flex>
							))}
						</React.Fragment>
					)
			)}
		</Flex>
	);
};
