import { Metadata } from 'next';

import { getProductsList } from '@/actions/products';
import Overview from '@/modules/user/components/overview';
import { getRegion } from '@/actions/region';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Trang cá nhân',
  description: 'Trang cá nhân của bạn',
};

export default async function UserPage() {
  return <Overview />;
}
