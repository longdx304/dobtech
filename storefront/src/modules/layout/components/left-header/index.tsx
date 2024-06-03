'use client';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Mail, ChevronLeft, AlignJustify } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Flex } from '@/components/Flex';
import DrawCategory from '@/modules/common/components/menu/DrawCategory';
import { TTreeCategories } from '@/types/productCategory';

type Props = {
  categories: TTreeCategories[] | null;
};

const LeftHeader: React.FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const showMail = ['/'];
  const hiddenBackIcon = ['/'];

  return (
    <Flex>
      {/* Show mail icon */}
      {showMail.includes(pathname) && (
        <Button
          icon={<AlignJustify color='#767676' size={24} strokeWidth='2' />}
          shape='circle'
          type='text'
          onClick={() => setOpen(true)}
        />
      )}

      {/* Show back page icon */}
      {!hiddenBackIcon.includes(pathname) && (
        <Flex justify='flex-start' align='center'>
          <Button
            icon={<ChevronLeft color='#767676' size={24} strokeWidth='2' />}
            shape='circle'
            type='text'
            onClick={() => router.back()}
          />
          <Button
            icon={<AlignJustify color='#767676' size={24} strokeWidth='2' />}
            shape='circle'
            type='text'
            onClick={() => setOpen(true)}
          />
        </Flex>
      )}
      <DrawCategory
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
      />
    </Flex>
  );
};

export default LeftHeader;
