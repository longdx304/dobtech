import ProfilePhone from '@/modules/user/components/profile-phone';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNA | Đổi số điện thoại',
  description: 'Đổi số điện thoại cá nhân của bạn',
};

export default function PhoneChangePage() {
  return <ProfilePhone />;
}
