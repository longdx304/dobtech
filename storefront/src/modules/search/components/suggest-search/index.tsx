import { useProducts } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

type Props = {
  searchValue?: string;
};

const PAGE_SIZE = 10;

const SuggestSearch: FC<Props> = ({ searchValue }) => {
  const { setItem, getItem } = useLocalStorage('recentSearches');
  const router = useRouter();

  const { products } = useProducts({
    limit: PAGE_SIZE,
    offset: 0,
    q: searchValue || undefined,
  });

  const handleClick = (value: string) => {
    const recentSearches = getItem() || [];
    if (recentSearches && !recentSearches.includes(value)) {
      const newRecentSearches = [...recentSearches, value];
      setItem(newRecentSearches);
    } else {
      setItem([value]);
    }
    router.push(`/search/${value}`);
  };

  return (
    <Flex vertical align='flex-start' justify='center' className='px-4 pt-1'>
      <Text strong>{'Đề xuất'}</Text>
      {products && products?.length > 0 && (
        <Flex
          vertical
          align='flex-start'
          justify='flex-start'
          className='pt-2 w-full'
        >
          {products?.map((product) => (
            <Flex
              key={product.id}
              vertical
              align='flex-start'
              justify='flex-start'
              className='w-full py-4'
              style={{ borderBottom: '1px solid #d9d9d9' }}
              onClick={() => handleClick(product.title!)}
            >
              <Text>{product.title}</Text>
            </Flex>
          ))}
        </Flex>
      )}
      {products?.length === 0 && (
        <Text className='pt-2 w-full'>{'Không tìm thấy kết quả phù hợp.'}</Text>
      )}
    </Flex>
  );
};

export default SuggestSearch;
