'use client';
import { adminLogIn } from '@/services/accounts';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/modules/common/components/error-message';
import SubmitButton from '@/modules/common/components/submit-button';
import { useFormState } from 'react-dom';

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
							<Input
								type="email"
								name="email"
								placeholder="Email *"
								data-testid="email"
							/>
							<ErrorMessage error={state?.email} data-testid="errorEmail" />
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								name="password"
								placeholder="Mật khẩu *"
								data-testid="password"
							/>
							<ErrorMessage
								error={state?.password}
								data-testid="errorPassword"
							/>
						</div>
						<ErrorMessage error={state?.result} data-testid="error" />
						<SubmitButton className="w-full" data-testid="submitBtn">
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
