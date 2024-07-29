import { getRegion } from '@/actions/region';
import AddressBook from '@/modules/user/components/addressbook';
import { notFound } from 'next/navigation';

export default async function AddressBookPage() {
  const region = await getRegion('vn');

  if (!region) {
    notFound();
  }

  return <AddressBook region={region} />;
}
