import { Button } from '@/components/Button';
import { Text } from '@/components/Typography';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';

const SignInPrompt = () => {
  return (
    <div className='bg-white flex items-center justify-between'>
      <div>
        <h1>Already have an account?</h1>
      </div>
      <div>
        <LocalizedClientLink href='user/auth'>
          <Button className='h-10' data-testid='sign-in-button'>
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default SignInPrompt;
