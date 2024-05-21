"use client";
import { FC } from "react";
import { Home, List, BadgePlus, ShoppingCart, UserRound } from "lucide-react";

import { Card } from "@/components/Card";
import { Flex } from "@/components/Flex";
import { cn } from "@/lib/utils";
import { TTreeCategories } from "@/types/productCategory";
import { Text } from "@/components/Typography";

interface Props {
	categories: TTreeCategories[] | null;
}

const Menu: FC<Props> = ({ categories }) => {
	return (
		<Card
			className={cn(
				"fixed bottom-0 w-full shadow px-0 pt-0 pb-0 rounded-none transition-all ease-in-out duration-300 z-10 h-[50px] block lg:hidden"
			)}
			bordered={false}
		>
			<Flex
				className="container box-border py-1 text-[#767676]"
				justify="space-between"
				algn="center"
			>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
				>
					<Home size={22} strokeWidth={2} />
					<Text className={cn("text-[11px] text-[#767676]")}>
						{"Mua sắm"}
					</Text>
				</Flex>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
				>
					<List size={22} strokeWidth={2} />
					<Text className={cn("text-[11px] text-[#767676]")}>
						{"Danh mục"}
					</Text>
				</Flex>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
				>
					<BadgePlus size={22} strokeWidth={2} />
					<Text className={cn("text-[11px] text-[#767676]")}>
						{"Mới"}
					</Text>
				</Flex>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
				>
					<ShoppingCart size={22} strokeWidth={2} />
					<Text className={cn("text-[11px] text-[#767676]")}>
						{"Giỏ hàng"}
					</Text>
				</Flex>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
				>
					<UserRound size={22} strokeWidth={2} />
					<Text className={cn("text-[11px] text-[#767676]")}>
						{"Tôi"}
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
};

export default Menu;
