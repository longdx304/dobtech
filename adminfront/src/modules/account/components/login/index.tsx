'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { adminLogIn } from '@/services/accounts';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/modules/common/components/submit-button';
import { useFormState } from 'react-dom';
import ErrorMessage from '@/modules/common/components/error-message';

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
			<Card className="w-[300px] sm:w-[400px]">
				<CardHeader className="flex justify-center items-center">
					<CardTitle>Đăng nhập</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" action={formAction}>
						<div className="space-y-2">
							<Input type="email" name="email" placeholder="Email *" />
							<ErrorMessage error={state?.email} />
						</div>
						<div className="space-y-2">
							<Input type="password" name="password" placeholder="Mật khẩu *" />
							<ErrorMessage error={state?.password} />
						</div>
						<ErrorMessage error={state?.result} />
						<SubmitButton className="w-full" type="submit">
							Xác nhận
						</SubmitButton>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center"></CardFooter>
			</Card>
		</div>
	);
};

export default LoginTemplate;
