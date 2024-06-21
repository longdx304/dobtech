import ProfileName from '@/modules/user/components/profile-name';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Chỉnh sửa tên tài khoản',
  description: 'Chỉnh sửa tên tài khoản cá nhân của bạn',
};

export default function ProfileNamePage() {
  return <ProfileName />;
}
