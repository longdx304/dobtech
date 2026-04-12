import { User } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { adminAuthKeys, useMedusa } from 'medusa-react';

import { buildOptions } from '@/utils/build-options';

export type AdminUpdateMyProfilePayload = {
	first_name?: string;
	last_name?: string;
	phone?: string;
};

export type AdminUpdateMyProfileRes = { user: User };

export const useAdminUpdateMyProfile = (
	options?: UseMutationOptions<
		Response<AdminUpdateMyProfileRes>,
		Error,
		AdminUpdateMyProfilePayload
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminUpdateMyProfilePayload) =>
			client.admin.custom.post<
				AdminUpdateMyProfilePayload,
				AdminUpdateMyProfileRes
			>('/admin/me/profile', payload),
		buildOptions(queryClient, [adminAuthKeys.all], options)
	);
};

export type AdminChangeMyPasswordPayload = {
	old_password: string;
	new_password: string;
};

export type AdminChangeMyPasswordRes = { user: User };

export const useAdminChangeMyPassword = (
	options?: UseMutationOptions<
		Response<AdminChangeMyPasswordRes>,
		Error,
		AdminChangeMyPasswordPayload
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminChangeMyPasswordPayload) =>
			client.admin.custom.post<
				AdminChangeMyPasswordPayload,
				AdminChangeMyPasswordRes
			>('/admin/me/password', payload),
		buildOptions(queryClient, [adminAuthKeys.all], options)
	);
};
