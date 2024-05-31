import { Metadata } from 'next';

import Overview from '@/modules/user/components/overview';
import { getCustomer } from '@/actions/customer';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Trang cá nhân',
  description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
  const customer = await getCustomer().catch(() => null)
  
  return (
    <div className='w-full box-border pt-[4rem] lg:pt-[8rem]'>
      <Overview customer={customer} />
    </div>
  );
}
