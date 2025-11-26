import { FC } from 'react';

import CartButton from '@/modules/layout/components/cart-button';
import SearchProduct from '@/modules/layout/components/search-input.tsx';
import UserInformation from '@/modules/layout/components/user-information';
import { Flex } from 'antd';
import Image from 'next/image';
import LocalizedClientLink from '../localized-client-link';

interface Props {}

const HeaderWrap: FC<Props> = ({}) => {
	return (
		<Flex
			className="w-full hidden lg:flex py-4"
			justify="space-between"
			align="center"
		>
			<div className="items-center w-[180px] h-[54px] overflow-hidden flex-shrink-0">
				<LocalizedClientLink href="/">
					<Image
						src="/syna-logo/LOGO/logo.svg"
						width={180}
						height={54}
						alt="Syna Logo"
						className="w-full h-full object-contain"
						priority
					/>
				</LocalizedClientLink>
			</div>
			<Flex
				gap="small"
				className="justify-end items-center w-full pr-3 lg:pr-0"
			>
				{/* Search */}
				<SearchProduct />

				{/* Cart */}
				{/* <CartButton /> */}

				{/* User Information */}
				<UserInformation data-testid="nav-account-link" />
			</Flex>
		</Flex>
	);
};

export default HeaderWrap;
