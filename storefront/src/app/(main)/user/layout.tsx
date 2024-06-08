import { getCustomer } from '@/actions/customer';
import { CustomerProvider } from '@/lib/providers/user/user-provider';
import { ReactNode } from 'react';

interface UserLayoutProps {
  children: ReactNode;
}
export default async function UserLayout({ children }: UserLayoutProps) {
  const customer = await getCustomer();

  return (
    <CustomerProvider initialCustomer={customer}>
      <div className='w-full box-border pt-[1rem]'>{children}</div>
    </CustomerProvider>
  );
}
