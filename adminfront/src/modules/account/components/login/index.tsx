'use client';
import { Lock, LogIn, Mail } from 'lucide-react';

import { Card } from '@/components/Card';
import { Input, InputPassword } from '@/components/Input';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/modules/common/components/error-message';
import { SubmitButton } from '@/components/Button';
import { adminLogIn } from '@/services/accounts';
import { useFormState } from 'react-dom';
import { ErrorText } from '@/components/Typography';

interface Props {}

const LoginTemplate = ({}: Props) => {
	const [state, formAction] = useFormState(adminLogIn, null);

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center fixed w-full h-full',
				'sm:justify-between sm:py-32 sm:relative'
			)}
		>
			<Card className="[&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:justify-start [&_.ant-card-body]:gap-4" bordered={true}>
				<div className="text-2xl text-center font-bold">Đăng nhập</div>
				<form className="space-y-4" action={formAction}>
					<div className="space-y-2">
						<Input
							name="email"
							placeholder="Email"
							prefix={<Mail />}
							data-testid="email"
							error={state?.email}
							autoFocus
						/>
					</div>
					<div className="space-y-2">
						<InputPassword
							name="password"
							placeholder="Mật khẩu"
							data-testid="password"
							prefix={<Lock />}
							error={state?.password}
						/>
					</div>
					<ErrorText error={state?.result} />
					<SubmitButton
						className="w-full !flex !items-center !justify-center"
						data-testid="submitBtn"
						icons={<LogIn color="white" />}
					>
						Xác nhận
					</SubmitButton>
				</form>
			</Card>
		</div>
	);
};

export default LoginTemplate;
