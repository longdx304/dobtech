'use client';

import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { Region } from '@medusajs/medusa';
import dynamic from 'next/dynamic';

type AddressBookProps = {
	region: Region;
};

const AddressBookDesktop = dynamic(() => import('./AddressBookDesktop'));
const AddressBookMobile = dynamic(() => import('./AddressBookMobile'));

const AddressBook = ({ region }: AddressBookProps) => {
	const isDesktop = useIsDesktop();

	return isDesktop ? (
		<AddressBookDesktop region={region} />
	) : (
		<AddressBookMobile region={region} />
	);
};

export default AddressBook;
