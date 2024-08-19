import { Button } from '@/components/Button';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: '404',
  description: 'Something went wrong',
};

export default function NotFound() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center h-full p-4 text-center overflow-hidden'>
      <h1 className='text-red-600 text-4xl font-bold'>Oops!</h1>
      <p className='text-xl font-bold'>Trang này không tồn tại</p>
      <p className='text-gray-500'>
        Rất tiếc, trang bạn tìm kiếm không tồn tại. Hãy quay lại trang chủ để
        tiếp tục mua sắm.
      </p>
      <div className='w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto'>
        <Image
          src='/images/404.webp'
          alt='404'
          width={600}
          height={400}
          className='w-full object-contain'
        />
      </div>
      <LocalizedClientLink href='/'>
        <Button
          icon={<ArrowLeft size={16} />}
          className='flex items-center justify-center'
        >
          Quay lại trang chủ
        </Button>
      </LocalizedClientLink>
    </div>
  );
}
