"use client";
import { FC, useMemo, Fragment, useState } from "react";
import { Col, Row } from "antd";
import { ChevronRight } from "lucide-react";

import Image from "next/image";
import { Dropdown } from "@/components/Dropdown";
import { TTreeCategories } from "@/types/productCategory";
import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import { cn } from "@/lib/utils";
interface Props {
	categories: TTreeCategories[] | null;
}

const items: any = [
	{
		key: "1",
		label: (
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.antgroup.com"
			>
				1st menu item
			</a>
		),
	},
	{
		key: "2",
		label: (
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.aliyun.com"
			>
				2nd menu item (disabled)
			</a>
		),
		disabled: true,
	},
	{
		key: "3",
		label: (
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.luohanacademy.com"
			>
				3rd menu item (disabled)
			</a>
		),
		disabled: true,
	},
	{
		key: "4",
		danger: true,
		label: "a danger item",
	},
];

const Category: FC<Props> = ({ categories }) => {
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
								activeItem={hoveredItem}
								handleMouseEnter={handleMouseEnter}
							/>
						</Col>
						<Col span={19} className="border-l border-slate-200/80">
							<CategoryGroup />
						</Col>
						{/* <Col span={10}>
							<div>123</div>
						</Col> */}
					</Row>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hoveredItem]);

	return (
		<Dropdown
			overlayStyle={{ width: "100%", left: "0px" }}
			className="category"
			// menu={{ items }}
			dropdownRender={(menu) => dropdownRender}
			// open={true}
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
	);
};

export default Category;

const CategoryNav = ({
	categories,
	activeItem,
	handleMouseEnter
}: {
	categories: TTreeCategories[] | null;
	activeItem: string;
	handleMouseEnter: (categoryId: string) => void;
}) => {
	return (
		<Flex vertical className="w-full">
			{categories?.map((category) => (
				<Flex
					onMouseEnter={() => handleMouseEnter(category.id)}
					justify="space-between"
					align="items-center"
					className={cn(
						"group w-full cursor-pointer hover:bg-slate-200/30 rounded-[8px] py-2 px-2 box-border transition-all",
						activeItem === category.id && "bg-slate-200/30"
					)}
					key={category.id}
				>
					<Text className="text-[12px] text-[#666666] font-normal">
						{category.label}
					</Text>
					<ChevronRight
						className={cn(
							"group-hover:translate-x-1",
							activeItem === category.id && "translate-x-1"
						)}
					/>
				</Flex>
			))}
		</Flex>
	);
};

const CategoryGroup = ({ categories }: { categories: TTreeCategories[] }) => {
	return (
		<Flex gap="middle" className="w-full">
			<Flex
				vertical
				gap="small"
				align="center"
				className="cursor-pointer"
			>
				<div className="h-14 w-14 bg-slate-300/40 rounded-full" />
				<Text className="text-[12px] text-[#666666] font-normal">
					Category Item
				</Text>
			</Flex>
			<Flex
				vertical
				gap="small"
				align="center"
				className="cursor-pointer"
			>
				<div className="h-14 w-14 bg-slate-300/40 rounded-full" />
				<Text className="text-[12px] text-[#666666] font-normal">
					Category Item
				</Text>
			</Flex>
			<Flex
				vertical
				gap="small"
				align="center"
				className="cursor-pointer"
			>
				<div className="h-14 w-14 bg-slate-300/40 rounded-full" />
				<Text className="text-[12px] text-[#666666] font-normal">
					Category Item
				</Text>
			</Flex>
		</Flex>
	);
};
