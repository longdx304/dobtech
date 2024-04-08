'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Mail, Lock, LogIn } from 'lucide-react';

import { adminLogIn } from '@/services/accounts';
import { cn } from '@/lib/utils';
import Card from '@/components/Card';
import { useFormState } from 'react-dom';
import ErrorMessage from '@/modules/common/components/error-message';
import { Input, InputPassword } from '@/components/Input';
import SubmitButton from '@/modules/common/components/submit-button';

interface Props {}

const LoginTemplate = ({}: Props) => {
	const [state, formAction] = useFormState(adminLogIn, null);

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center fixed w-full h-full',
				'sm:justify-between sm:p-32 sm:relative'
			)}
		>
			<Card className="flex flex-col justify-start gap-4">
				<div className="text-2xl text-center font-bold">Đăng nhập</div>
				<form className="space-y-4" action={formAction}>
					<div className="space-y-2">
						<Input
							type="email"
							name="email"
							placeholder="Email"
							prefix={<Mail />}
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
							prefix={<Lock />}
							required
						/>
						<ErrorMessage error={state?.password} />
					</div>
					<ErrorMessage error={state?.result} />
					<SubmitButton className="w-full !flex !items-center !justify-center" icon={<LogIn color="white" />}>
						Xác nhận
					</SubmitButton>
				</form>
			</Card>
		</div>
	);
};

export default LoginTemplate;
