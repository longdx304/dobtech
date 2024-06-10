import { getCustomer } from '@/actions/customer';
import { getRegion } from '@/actions/region';
import AddressBook from '@/modules/user/components/addressbook';
import { notFound } from 'next/navigation';

export default async function AddressBookPage() {
  const customer = await getCustomer();
  const region = await getRegion('vn');

  if (!customer || !region) {
    notFound();
  }

  return <AddressBook customer={customer} region={region} />;
}
