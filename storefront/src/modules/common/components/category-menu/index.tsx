import { FC, React } from "react";
import { Row, Col } from "antd";
import { ChevronRight } from "lucide-react";

import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

type Props = {
	categories: TTreeCategories[] | null;
	activeItem: string | null;
	handleMouseEnter: (categoryId: string) => void;
	isMobile?: boolean;
};

const CategoryMenu: FC<Props> = ({
	categories,
	activeItem,
	handleMouseEnter,
	isMobile = false,
}) => {
	return (
		<div
			className={cn(
				"w-full bg-slate-50 shadow-xl py-4",
				isMobile && "shadow-none py-2 bg-transparent"
			)}
		>
			<div className={cn(!isMobile && "container")}>
				<Row className="" gutter={[16, 0]}>
					<Col xs={8} sm={4}>
						<CategoryNav
							categories={categories}
							activeItem={activeItem!}
							handleMouseEnter={handleMouseEnter}
							isMobile={isMobile}
						/>
					</Col>
					<Col
						xs={16}
						sm={20}
						className="border-l border-slate-200/80"
					>
						<CategoryGroup
							categories={categories!}
							activeItem={activeItem}
						/>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default CategoryMenu;

const CategoryNav = ({
	categories,
	activeItem,
	handleMouseEnter,
	isMobile = false,
}: {
	categories: TTreeCategories[] | null;
	activeItem: string;
	handleMouseEnter: (categoryId: string) => void;
	isMobile?: boolean;
}) => {
	return (
		<Flex vertical className="w-full">
			{categories?.map((category) =>
				isMobile ? (
					<div key={category.id}>
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
									activeItem === category.id &&
										"translate-x-1"
								)}
								color="#767676"
								size={20}
							/>
						</Flex>
					</div>
				) : (
					<LocalizedClientLink
						href={`categories/${category.key}`}
						key={category.id}
					>
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
									activeItem === category.id &&
										"translate-x-1"
								)}
								color="#767676"
								size={20}
							/>
						</Flex>
					</LocalizedClientLink>
				)
			)}
		</Flex>
	);
};

const CategoryGroup = ({
	categories,
	activeItem,
}: {
	categories: TTreeCategories[] | null;
	activeItem: string | null;
}) => {
	const formattedText = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	};

	const url = "https://ananas.vn/wp-content/uploads/Pro_AV00205_1.jpeg";

	return (
		<Flex gap="middle" className="w-full">
			{categories?.map(
				(category) =>
					category.id === activeItem &&
					category.children &&
					category.children.length > 0 && (
						<Flex
							className="w-full flex-wrap"
							key={category.id}
							gap="middle"
							justify="start"
							align="center"
						>
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
						</Flex>
					)
			)}
		</Flex>
	);
};
