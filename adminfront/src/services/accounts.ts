'use server';

import { revalidateTag } from 'next/cache';
import { getToken } from '@/actions/accounts';
import { z } from 'zod';
import handleErrorZod from '@/lib/utils';

const loginSchema = z.object({
	email: z.string().email('Email không đúng định dạng'),
	password: z.string().min(6, {
		message: 'Mật khẩu phải ít nhất phải có 6 ký tự',
	}),
});
const createMemberSchema = z.object({
	email: z.string().email('Email không đúng định dạng'),
	fullName: z
		.string()
		.min(2, {
			message: 'Tên phải có ít nhất 2 ký tự',
		})
		.max(50, {
			message: 'Tên không được vượt quá 50 ký tự',
		}),
	phone: z
		.string()
		.min(10, {
			message: 'Số điện thoại phải có ít nhất 10 số',
		})
		.max(12, {
			message: 'Số điện thoại không được vượt quá 12 số',
		}),
	rolesEmp: z.array(z.string()).refine(value => value.length > 0, {
    message: 'Quyền nhân viên phải chứa ít nhất một giá trị',
    // path: ['rolesEmp'],
  }),
});

export async function adminLogIn(_currentState: unknown, formData: FormData) {
	try {
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const resolver = handleErrorZod(loginSchema.safeParse({ email, password }));
		if (resolver) {
			return resolver;
		}
		// Medusa get token from user
		await getToken({ email, password }).then(() => {
			revalidateTag('admin');
		});
		return { result: null };
	} catch (error: any) {
		return { result: 'Email hoặc mật khẩu không đúng!' };
	}
}

export async function createMember(_currentState: unknown, formData: FormData) {
	try {
		const email = formData.get('email') as string;
		const fullName = formData.get('fullName') as string;
		const phone = formData.get('phone') as number;
		const rolesEmp = formData.getAll('rolesEmp') as any;

		console.log(' aaa ', rolesEmp);
		const resolver = handleErrorZod(
			createMemberSchema.safeParse({ email, fullName, phone, rolesEmp })
		);
		if (resolver) {
			return resolver;
		}
	} catch (error) {
		console.log(' error ', error.message);
	}
}
