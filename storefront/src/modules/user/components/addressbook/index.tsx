'use client';

import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { Region } from '@medusajs/medusa';
import AddressBookDesktop from './AddressBookDesktop';
import AddressBookMobile from './AddressBookMobile';

type AddressBookProps = {
	region: Region;
};

const AddressBook = ({ region }: AddressBookProps) => {
	const isDesktop = useIsDesktop();

	return isDesktop ? (
		<AddressBookDesktop region={region} />
	) : (
		<AddressBookMobile region={region} />
	);
};

export default AddressBook;
