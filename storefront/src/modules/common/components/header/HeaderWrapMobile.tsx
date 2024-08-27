import { Search } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import CartButton from '@/modules/layout/components/cart-button';
import LeftHeader from '@/modules/layout/components/left-header';
import LocalizedClientLink from '../localized-client-link';
import { TTreeCategories } from '@/types/productCategory';

interface Props {
	categories: TTreeCategories[] | null;
}

const HeaderWrapMobile: FC<Props> = ({ categories }) => {
	return (
		<div className="relative items-center justify-between z-11 h-[42px] block lg:hidden box-border">
			<div className="flex w-fit items-center absolute z-[12]">
				<LeftHeader categories={categories} />
			</div>
			<div className="absolute z-11 w-full flex justify-center items-center">
				<LocalizedClientLink href="/" className="w-[100px] h-[42px] overflow-hidden">
					<Image
						src="/images/dob-icon.webp"
						width={100}
						height={42}
						alt="Dob Icon"
						className='w-full h-full object-contain'
						priority
					/>
				</LocalizedClientLink>
			</div>
			<div className="absolute right-[0] z-[12] pr-4 max-[320px]:pr-0">
				<Flex gap="2px" className="justify-between w-full">
					{/* Search */}
					<LocalizedClientLink href="search">
						<Button
							shape="circle"
							type="text"
							icon={<Search />}
							aria-label="Search Products"
						/>
					</LocalizedClientLink>

					{/* Cart */}
					<CartButton />
				</Flex>
			</div>
		</div>
	);
};

export default HeaderWrapMobile;
