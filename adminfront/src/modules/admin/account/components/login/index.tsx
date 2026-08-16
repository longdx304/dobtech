'use client';

import { Lock, LogIn, Mail } from 'lucide-react';

import { setCookie, setUserData } from '@/actions/auth';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input, InputPassword } from '@/components/Input';
import { ERoutes } from '@/types/routes';
import { Form, FormProps, message } from 'antd';
import { useAdminLogin, useMedusa } from 'medusa-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type FormValues = {
	email: string;
	password: string;
};

type LoginTemplateProps = {};

const LoginTemplate = ({}: LoginTemplateProps) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();
	const { client } = useMedusa();

	const { mutateAsync, isLoading } = useAdminLogin();

	const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
		mutateAsync(values, {
			onSuccess: async (data) => {
				await client.admin.auth
					.getToken(values)
					.then(async ({ access_token }) => {
						await setCookie(access_token);
						// Fetch user role/permissions once at login and cache in cookie
						// so middleware can read them without calling the backend on every request
						const res = await fetch(
							`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/auth`,
							{ headers: { Authorization: `Bearer ${access_token}` } }
						);
						const { user } = await res.json();
						await setUserData(user.role, user.permissions);
					});
				message.success('Đăng nhập thành công!');
				router.push(ERoutes.HOME);
			},
			onError: () => {
				message.error('Đăng nhập thất bại!');
			},
		});
	};

	return (
		<main className="relative min-h-[100dvh] w-full overflow-x-hidden bg-slate-950">
			{contextHolder}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage: "url('/images/dob-warehouse-login-bg.jpg')",
				}}
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-slate-950/55 lg:bg-[linear-gradient(90deg,rgba(6,20,47,0.88)_0%,rgba(15,38,78,0.42)_52%,rgba(6,20,47,0.68)_100%)]"
			/>

			<section className="pointer-events-none absolute inset-y-0 left-[8vw] z-10 hidden max-w-[520px] flex-col justify-center text-white xl:flex">
				<span className="mb-5 w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-sm">
					Warehouse Management System
				</span>
				<h1 className="text-5xl font-bold leading-tight tracking-tight">
					Quản lý kho chính xác.
					<br />
					Vận hành đồng bộ.
				</h1>
				<p className="mt-5 max-w-[460px] text-base leading-7 text-blue-50/85">
					Theo dõi nhập hàng, xuất hàng, kiểm hàng và tồn kho trên cùng một
					hệ thống DOB Warehouse.
				</p>
			</section>

			<section className="relative z-20 box-border flex min-h-[100dvh] w-full items-center justify-center px-4 py-8 sm:px-8 lg:p-0">
				<div className="w-full max-w-[420px] lg:absolute lg:right-[clamp(2rem,5vw,6rem)] lg:top-1/2 lg:w-[420px] lg:-translate-y-1/2">
					<div className="mb-5 flex items-center justify-center gap-3 text-white lg:justify-start">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
							<Image
								src="/images/dob-icon.png"
								alt="DOB"
								width={30}
								height={40}
								priority
							/>
						</div>
						<div>
							<div className="text-2xl font-bold tracking-tight">DOB Warehouse</div>
							<div className="text-sm text-blue-100/85">
								Warehouse Management System
							</div>
						</div>
					</div>

					<Card
						rounded
						className="border border-white/50 bg-white/95 shadow-2xl backdrop-blur-md [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:gap-4 [&_.ant-card-body]:p-6 sm:[&_.ant-card-body]:p-8"
					>
						<div>
							<h2 className="m-0 text-2xl font-bold text-slate-900">Đăng nhập</h2>
							<p className="mb-0 mt-2 text-sm text-slate-500">
								Sử dụng tài khoản nội bộ để tiếp tục.
							</p>
						</div>
						<Form
							id="form-user"
							form={form}
							onFinish={onFinish}
							layout="vertical"
							autoComplete="on"
						>
							<Form.Item
								name="email"
								rules={[
									{ type: 'email', message: 'Email không đúng định dạng!' },
									{
										required: true,
										whitespace: true,
										message: 'Email phải được nhập!',
									},
								]}
								label="Email"
							>
								<Input
									placeholder="name@dobtech.vn"
									prefix={<Mail size={20} color="rgb(100 116 139)" />}
									className="h-12"
									autoComplete="email"
									data-testid="email"
								/>
							</Form.Item>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Mật khẩu phải có ít nhất 2 ký tự!',
									},
								]}
								label="Mật khẩu"
							>
								<InputPassword
									placeholder="Nhập mật khẩu"
									prefix={<Lock size={20} color="rgb(100 116 139)" />}
									className="h-12"
									autoComplete="current-password"
									data-testid="password"
								/>
							</Form.Item>
							<Form.Item className="mb-0">
								<Button
									type="primary"
									htmlType="submit"
									icons={<LogIn color="white" />}
									className="flex h-12 w-full items-center justify-center text-base font-semibold"
									loading={isLoading}
									data-testid="submitBtn"
								>
									Đăng nhập
								</Button>
							</Form.Item>
						</Form>
					</Card>

					<p className="mt-5 text-center text-xs text-white/70 lg:text-left">
						Hệ thống quản lý kho nội bộ DOBTECH
					</p>
				</div>
			</section>
		</main>
	);
};

export default LoginTemplate;
