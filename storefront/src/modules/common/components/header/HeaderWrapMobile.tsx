import { FC, Suspense } from "react";
import { ShoppingCart, Search } from "lucide-react";
import Image from "next/image";

import { BadgeButton, Button } from "@/components/Button";
import CartButton from "@/modules/layout/components/cart-button";
import SearchInput from "@/modules/layout/components/search-input.tsx";
import UserInformation from "@/modules/layout/components/user-information";
import LeftHeader from "@/modules/layout/components/left-header";
import { Flex } from "@/components/Flex";
import LocalizedClientLink from "../localized-client-link";

interface Props {}

const HeaderWrapMobile: FC<Props> = ({}) => {
	return (
		<div className="relative flex items-center justify-between z-11 h-[42px] block lg:hidden box-border">
			<div className="flex w-fit items-center absolute z-[12]">
				<LeftHeader />
			</div>
			<div className="absolute z-11 w-full flex justify-center items-center">
				<LocalizedClientLink href="/">
					<Image  src='/images/CHAMDEP_logo.png' width={100} height={42} alt="Dob Icon" />
				</LocalizedClientLink>
			</div>
			<div className="absolute right-[0] z-[12] pr-4">
				<Flex
					gap="2px"
					className="justify-between justify-end w-full"
				>
					{/* Search */}
					<LocalizedClientLink href="search">
						<Button shape="circle" type="text" icon={<Search />} />
					</LocalizedClientLink>
					{/* Cart */}
					<Suspense
						fallback={
							<LocalizedClientLink
								className="flex gap-2"
								href="cart"
								data-testid="nav-cart-link"
							>
								<BadgeButton
									icon={
										<ShoppingCart
											className="stroke-2"
											color="#767676"
										/>
									}
									count={0}
									showZero
									offset={[-10, 10]}
								/>
							</LocalizedClientLink>
						}
					>
						<CartButton />
					</Suspense>
				</Flex>
			</div>
		</div>
	);
};

export default HeaderWrapMobile;
