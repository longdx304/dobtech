'use client';
import { BadgePlus, Home, List, ShoppingCart, UserRound } from 'lucide-react';
import { FC, useState } from 'react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { cn } from '@/lib/utils';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { TTreeCategories } from '@/types/productCategory';
import { usePathname } from 'next/navigation';
import DrawCategory from './DrawCategory';

interface Props {
	categories: TTreeCategories[] | null;
}

const Menu: FC<Props> = ({ categories }) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const showMenu = ['/', '/user'];

	if (!showMenu.includes(pathname)) return null;
	return (
		<Card
			className={cn(
				'fixed bottom-0 w-full shadow px-0 pt-0 pb-0 rounded-none transition-all ease-in-out duration-300 z-10 h-[50px] block lg:hidden'
			)}
			bordered={false}
		>
			<Flex
				className="box-border py-1 text-[#767676]"
				justify="space-between"
				align="center"
			>
				<LocalizedClientLink
					className="flex-1 gap-2"
					href="/"
					data-testid="nav-cart-link"
				>
					<Flex
						vertical
						justify="center"
						align="center"
						className={cn(
							'flex-1 text-[#767676]',
							pathname === '/' && 'text-black'
						)}
					>
						<Home size={22} strokeWidth={2} />
						<Text className={cn('text-[11px]')}>{'Mua sắm'}</Text>
					</Flex>
				</LocalizedClientLink>
				<Flex
					vertical
					justify="center"
					align="center"
					className="flex-1"
					onClick={() => setOpen(true)}
				>
					<List size={22} strokeWidth={2} />
					<Text className={cn('text-[11px] text-[#767676]')}>{'Danh mục'}</Text>
				</Flex>
				{/* <Flex vertical justify='center' align='center' className='flex-1'>
          <BadgePlus size={22} strokeWidth={2} />
          <Text className={cn('text-[11px] text-[#767676]')}>{'Mới'}</Text>
        </Flex> */}
				<Flex vertical justify="center" align="center" className="flex-1">
					<LocalizedClientLink
						href="cart"
						className="flex flex-col justify-center items-center text-[#767676]"
					>
						<ShoppingCart size={22} strokeWidth={2} />
						<Text className={cn('text-[11px] text-[#767676]')}>
							{'Giỏ hàng'}
						</Text>
					</LocalizedClientLink>
				</Flex>
				<Flex vertical justify="center" align="center" className="flex-1">
					<LocalizedClientLink
						href="user"
						className="flex flex-col justify-center items-center text-[#767676]"
					>
						<UserRound size={22} strokeWidth={2} />
						<Text className={cn('text-[11px] text-[#767676]')}>{'Tôi'}</Text>
					</LocalizedClientLink>
				</Flex>
			</Flex>
			<DrawCategory
				open={open}
				onClose={() => setOpen(false)}
				categories={categories}
			/>
		</Card>
	);
};

export default Menu;
