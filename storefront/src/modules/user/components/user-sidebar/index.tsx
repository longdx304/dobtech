'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import Menubar from './MenuBar';
import { usePathname } from 'next/navigation';

type Props = {
  className: string;
};

const Sidebar = ({ className }: Props) => {
  const pathname = usePathname();
  const hiddenSider = ['/user/auth'];

  const isSiderHidden = hiddenSider.some((path) => {
    const regex = new RegExp(`^${path}(/|$)`);
    return regex.test(pathname);
  });

  return (
    <>
      {!isSiderHidden && (
        <div className={cn('w-[30%] px-3', className)}>
          <Menubar />
        </div>
      )}
    </>
  );
};

export default Sidebar;
