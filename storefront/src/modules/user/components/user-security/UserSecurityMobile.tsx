import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { useCustomer } from '@/lib/providers/user/user-provider';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { ERoutes } from '@/types/routes';
import { List } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  data: any[];
};

const UserSecurityMobile = ({ data }: Props) => {
  const router = useRouter();

  return (
    <Flex
      justify='space-between'
      className='flex-col min-h-[98vh] bg-[#f6f6f6]'
    >
      <div className='user-security bg-white'>
        <Flex
          align='center'
          justify='space-between'
          style={{ borderBottom: '11px solid #f6f6f6' }}
          className='pb-2'
        >
          <div className='flex' onClick={() => router.back()}>
            <ChevronLeft size={24} className='text-[#767676] pl-[12px]' />
          </div>
          <Text className='font-bold text-center'>
            Quản lý tài khoản của tôi
          </Text>
          <div className='w-[36px]' />
        </Flex>

        <Flex
          className='flex-col'
          style={{ borderBottom: '11px solid #f6f6f6' }}
        >
          <List
            itemLayout='horizontal'
            dataSource={data}
            className='px-4 mt-0'
            renderItem={(item) => (
              <LocalizedClientLink href={item.href}>
                <List.Item
                  style={{
                    borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)',
                  }}
                  className='py-4'
                >
                  <Flex justify='space-between' className='w-full'>
                    <Text className='text-sm'>{item.title}</Text>
                    <Flex align='center' gap={4}>
                      <Text className='text-sm text-[#767676]'>
                        {item.value}
                      </Text>
                      <ChevronRight size={16} className='text-[#767676]' />
                    </Flex>
                  </Flex>
                </List.Item>
              </LocalizedClientLink>
            )}
          />
        </Flex>
      </div>
    </Flex>
  );
};

export default UserSecurityMobile;
