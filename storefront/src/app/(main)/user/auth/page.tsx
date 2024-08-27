import LoginTemplate from '@/modules/user/templates/login-template';
import { LOGIN_VIEW } from '@/types/auth';

export default function AuthPage() {
	return (
		<div className="w-full box-border container pt-[4rem] lg:pt-[8rem]">
			<LoginTemplate initialView={LOGIN_VIEW.SIGN_IN} />
		</div>
	);
}
