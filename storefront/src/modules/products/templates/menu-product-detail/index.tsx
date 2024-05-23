"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { FC, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Flex } from "@/components/Flex";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Props {}

const MenuProductDetail: FC<Props> = ({}) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	// const showMenu = ["/"];

	// if (!showMenu.includes(pathname)) return null;
	return (
		<Card
			className={cn(
				"fixed bottom-0 w-full shadow px-0 pt-0 pb-0 rounded-none transition-all ease-in-out duration-300 z-10 h-[50px] block lg:hidden"
			)}
			bordered={false}
		>
			<Flex
				className="box-border py-1 text-[#767676] h-auto px-4"
				justify="space-between"
				align="center"
				gap="middle"
			>
				<Heart size={28} strokeWidth={2} color="#000000" />
				<Button
					className="w-full flex items-center justify-center gap rounded-[4px]"
					icon={
						<ShoppingCart
							strokeWidth={2}
							size={24}
							color="#ffffff"
						/>
					}
					onClick={() => setOpen(true)}
				>
					THÊM VÀO GIỎ HÀNG
				</Button>
			</Flex>
		</Card>
	);
};

export default MenuProductDetail;
