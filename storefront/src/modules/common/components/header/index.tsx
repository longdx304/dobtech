"use client";
import { FC } from "react";

import { Card } from "@/components/Card";
import { Flex } from "@/components/Flex";
import { cn } from "@/lib/utils";
import { TTreeCategories } from "@/types/productCategory";
import { usePathname } from "next/navigation";
import Category from "./Category";
import HeaderWrap from "./HeaderWrap";
import HeaderWrapMobile from "./HeaderWrapMobile";

interface Props {
	categories: TTreeCategories[] | null;
}

const Header: FC<Props> = ({ categories }) => {
	const pathname = usePathname();

	const showCategory = ["/"];
	const hiddenHeader = ["/search"];

	return (
		<Card
			className={cn(
				"fixed top-0 w-full shadow px-0 pt-0 pb-0 rounded-none transition-all ease-in-out duration-300 z-10"
			)}
			bordered={false}
		>
			<Flex vertical className="box-border lg:container">
				{!hiddenHeader.includes(pathname) && (
					<>
						<HeaderWrap />
						<HeaderWrapMobile categories={categories} />
						{showCategory.includes(pathname) && (
							<Category categories={categories} />
						)}
					</>
				)}
			</Flex>
		</Card>
	);
};

export default Header;
