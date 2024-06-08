import { Metadata } from 'next';

import { getProductsList } from '@/actions/products';
import Overview from '@/modules/user/components/overview';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Trang cá nhân',
  description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
  const { response } = await getProductsList({
    pageParam: 0,
  } as any);

  return (
    <>
      <Overview products={response} />
    </>
  );
}
