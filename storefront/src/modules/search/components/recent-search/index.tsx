import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { isEmpty } from 'lodash-es';

type Props = {};

const hotSearches = ['Dép', 'Giày'];
const RecentSearch: FC<Props> = ({}) => {
	const { getItem, removeItem } = useLocalStorage('recentSearches');
	const router = useRouter();

	const handleClick = (value: string) => {
		router.push(`/search/keyword=${value}`);
	};

	return (
		<Flex
			vertical
			align="flex-start"
			justify="center"
			className="px-4 pt-1"
			gap="middle"
		>
			{!isEmpty(getItem()) && (
				<Flex vertical align="flex-start" justify="center" className="w-full">
					<Flex justify="space-between" align="center" className="w-full">
						<Text strong>{'Tìm kiếm gần đây'}</Text>
						<Trash2
							size={20}
							color="#4B5563"
							onClick={() => {
								removeItem();
								router.refresh();
							}}
							className="cursor-pointer"
						/>
					</Flex>
					<Flex justify="flex-start" align="center" className="pt-2">
						{getItem()?.map((hotSearch: string, index: number) => (
							<Tag
								key={index}
								onClick={() => handleClick(hotSearch)}
								className="text-sm px-3 py-2 text-gray-600 lg:cursor-pointer"
							>
								{hotSearch}
							</Tag>
						))}
					</Flex>
				</Flex>
			)}
			<Flex vertical align="flex-start" justify="center">
				<Text strong>{'Tìm kiếm và phát hiện'}</Text>
				<Flex justify="flex-start" align="center" className="pt-2">
					{hotSearches?.map((hotSearch: string, index: number) => (
						<Tag
							key={index}
							onClick={() => handleClick(hotSearch)}
							className="text-sm px-3 py-2 text-gray-600 lg:cursor-pointer"
						>
							{hotSearch}
						</Tag>
					))}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default RecentSearch;
