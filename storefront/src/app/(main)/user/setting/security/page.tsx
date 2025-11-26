import UserSecurity from '@/modules/user/components/user-security';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNA | Thiết lập bảo mật',
  description: 'Thiết lập bảo mật tài khoản của bạn',
};

export default async function SecurityPage() {
  return <UserSecurity />;
}
