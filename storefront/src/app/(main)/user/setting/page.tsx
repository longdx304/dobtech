import UserSetting from '@/modules/user/components/user-setting';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNA | Thiết lập tài khoản',
  description: 'Thiết lập tài khoản cá nhân của bạn',
};

export default async function SettingPage() {
  return <UserSetting />;
}
