'use client';

import React from 'react';
import AddressBookDesktop from './AddressBookDesktop';
import AddressBookMobile from './AddressBookMobile';
import { Region } from '@medusajs/medusa';

type AddressBookProps = {
  region: Region;
};

const AddressBook = ({ region }: AddressBookProps) => {
  return (
    <>
      <div className='hidden lg:block'>
        <AddressBookDesktop region={region} />
      </div>
      <div className='block lg:hidden'>
        <AddressBookMobile region={region} />
      </div>
    </>
  );
};

export default AddressBook;
