import LoginTemplate from '@/modules/user/templates/login-template';

export default function AuthPage() {
  return (
    <div className='w-full box-border container pt-[4rem] lg:pt-[8rem]'>
      <LoginTemplate />
    </div>
  );
}
