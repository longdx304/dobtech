import { Metadata } from 'next';

import { getProductsList } from '@/actions/products';
import Overview from '@/modules/user/components/overview';
import { getRegion } from '@/actions/region';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Trang cá nhân',
  description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
  const { response } = await getProductsList({
    pageParam: 0,
  } as any);

  const region = await getRegion('vn');


  return <Overview products={response} region={region!} />;
}
