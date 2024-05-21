'use client';
import { Button } from '@/components/Button';
import { Mail } from 'lucide-react';
import React from 'react';

const EmailButton = () => {
  return (
    <>
      <Button
        icon={<Mail className='stroke-2' color="#767676" />}
        shape='circle'
        type='text'
        onClick={() => {}}
        className='block lg:hidden'
      />
    </>
  );
};

export default EmailButton;
