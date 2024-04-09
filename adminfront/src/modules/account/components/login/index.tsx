'use client';
import { Lock, LogIn, Mail } from 'lucide-react';

import Card from '@/components/Card';
import { Input, InputPassword } from '@/components/Input';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/modules/common/components/error-message';
import SubmitButton from '@/modules/common/components/submit-button';
import { adminLogIn } from '@/services/accounts';
import { useFormState } from 'react-dom';

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
			<Card className="[&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:justify-start [&_.ant-card-body]:gap-4">
				<div className="text-2xl text-center font-bold">Đăng nhập</div>
				<form className="space-y-4" action={formAction}>
					<div className="space-y-2">
						<Input
							type="email"
							name="email"
							placeholder="Email"
							prefix={<Mail />}
							data-testid="email"
							required
							autoFocus
						/>
						<ErrorMessage error={state?.email} />
					</div>
					<div className="space-y-2">
						<InputPassword
							type="password"
							name="password"
							placeholder="Mật khẩu"
							data-testid="password"
							prefix={<Lock />}
							required
						/>
						<ErrorMessage error={state?.password} />
					</div>
					<ErrorMessage error={state?.result} />
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
