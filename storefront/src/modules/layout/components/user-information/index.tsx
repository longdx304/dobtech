'use client';
import { Button } from '@/components/Button';
import { User } from 'lucide-react';
import React from 'react';

const UserInformation = () => {
  return (
    <>
      <Button
        icon={<User className='stroke-2' />}
        shape='circle'
        type='text'
        onClick={() => {}}
        className=''
      />
    </>
  );
};

export default UserInformation;
