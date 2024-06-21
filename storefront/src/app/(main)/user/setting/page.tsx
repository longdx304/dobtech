import UserSetting from '@/modules/user/components/user-setting';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Thiết lập tài khoản',
  description: 'Thiết lập tài khoản cá nhân của bạn',
};

export default async function SettingPage() {
  return <UserSetting />;
}
