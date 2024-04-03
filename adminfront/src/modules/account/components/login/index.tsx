'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { adminLogIn } from '@/services/accounts';

import { cn } from '@/lib/utils';
import Card from '@/components/Card';
// import Card from '@mui/material/Card';
import { useFormState } from 'react-dom';
import ErrorMessage from '@/modules/common/components/error-message';
import { Input } from '@/components/Input';
import SubmitButton from '@/modules/common/components/submit-button';

interface Props {}

const LoginTemplate = ({}: Props) => {
	const [state, formAction] = useFormState(adminLogIn, null);

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center fixed w-full h-full',
				'sm:justify-between sm:p-32'
			)}
		>
			<Card className="flex flex-col justify-start gap-4">
				<div className="text-2xl text-center font-bold">Đăng nhập</div>
				<form className="space-y-4" action={formAction}>
					<div className="space-y-2">
						<Input type="email" name="email" label="Email" required autoFocus />
						<ErrorMessage error={state?.email} />
					</div>
					<div className="space-y-2">
						<Input type="password" name="password" label="Mật khẩu" required />
						<ErrorMessage error={state?.password} />
					</div>
					<ErrorMessage error={state?.result} />
					<SubmitButton className="w-full" variant="contained">
						Xác nhận
					</SubmitButton>
				</form>
			</Card>
		</div>
	);
};

export default LoginTemplate;
