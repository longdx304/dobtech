import Sidebar from '@/modules/user/components/user-sidebar';
import { ReactNode } from 'react';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className='w-full box-border lg:container pt-[1rem] lg:pt-[6rem] lg:flex'>
      <Sidebar className='hidden lg:block' />
      <div className='w-full lg:p-3'>{children}</div>
    </div>
  );
}
