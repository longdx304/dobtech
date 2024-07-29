'use client';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import {
	CircleDollarSign,
	Gift,
	Settings,
	TicketPercent,
	Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoginTemplate from '../../templates/login-template';

const ItemGroup = () => {
	const { state, onOpen, onClose } = useToggleState(false);
	const router = useRouter();
	const { customer } = useCustomer();

	const handleLoginClick = () => {
		if (!customer) {
			onOpen();
		}
	};

	const onCloseDrawer = () => {
		router.refresh();
		onClose();
	};

	return (
		<>
			{/* Login / Register */}
			<Flex
				className="flex-col space-y-2"
				style={{ borderBottom: '11px solid #f6f6f6' }}
			>
				<Flex
					align="center"
					justify="space-between"
					className="px-4 py-2"
					onClick={() => {
						handleLoginClick();
					}}
				>
					<Text className="text-lg font-semibold">
						{customer
							? `Chào, ${customer.first_name} ${customer.last_name}`
							: 'Đăng nhập / Đăng ký'}
					</Text>
					<Settings size={24} onClick={() => router.push('/user/setting')} />
				</Flex>

				{/* <Flex align='center' justify='space-between' className='px-4 pt-2 pb-4 lg:justify-around'>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <TicketPercent size={24} />
            <Text className='text-xs'>Phiếu giảm giá</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <CircleDollarSign size={24} />
            <Text className='text-xs'>Điểm</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <Wallet size={24} />
            <Text className='text-xs'>Ví</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <Gift size={24} />
            <Text className='text-xs'>Quà tặng</Text>
          </Flex>
        </Flex> */}
			</Flex>

			{/* My order */}
			{/* <Flex
        className='flex-col space-y-2 py-4'
        style={{ borderBottom: '11px solid #f6f6f6' }}
      >
        <Flex align='center' justify='space-between' className='px-4 py-2'>
          <Text className='text-md font-semibold'>Đơn hàng của tôi</Text>
          <Text className='flex items-center text-xs text-[#767676]'>
            Xem tất cả <ChevronRight size={12} />
          </Text>
        </Flex>
        <Flex align='center' justify='space-between' className='px-4 pt-2 pb-4'>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <WalletMinimal size={24} />
            <Text className='text-xs'>Chưa thanh toán</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <PackageSearch size={24} />
            <Text className='text-xs'>Xử lý</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <Truck size={24} />
            <Text className='text-xs'>Đã vận chuyển</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <MessageSquareQuote size={24} />
            <Text className='text-xs'>Đánh giá</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <SquareArrowLeft size={24} />
            <Text className='text-xs'>Trả lại</Text>
          </Flex>
        </Flex>
      </Flex> */}

			{/* Services */}
			{/* <Flex
        className='flex-col space-y-2 py-4'
        style={{ borderBottom: '11px solid #f6f6f6' }}
      >
        <Flex align='center' justify='space-between' className='px-4 py-2'>
          <Text className='text-md font-semibold'>Nhiều dịch vụ hơn</Text>
        </Flex>
        <Flex align='center' justify='space-between' className='px-4 pt-2 pb-4'>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <Headset size={24} />
            <Text className='text-xs'>Câu hỏi</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <NotebookPen size={24} />
            <Text className='text-xs'>Khảo sát</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <HandCoins size={24} />
            <Text className='text-xs'>Chia sẻ & kiềm tiền</Text>
          </Flex>
          <Flex
            align='center'
            className='flex-col gap-1'
            onClick={() => {
              handleLoginClick();
            }}
          >
            <SquareCheckBig size={24} />
            <Text className='text-xs'>Theo dõi</Text>
          </Flex>
        </Flex>
      </Flex> */}

			<Drawer
				open={state}
				placement="bottom"
				onClose={onClose}
				styles={{
					header: { borderBottom: 'none' },
					wrapper: { height: '100%' },
				}}
			>
				<LoginTemplate onCloseDrawer={onCloseDrawer} />
			</Drawer>
		</>
	);
};

export default ItemGroup;
