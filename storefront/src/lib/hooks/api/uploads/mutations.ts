import { buildOptions } from '@/lib/utils/build-options';
import { AdminUploadsRes } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';

export type AdminCreateUploadPayload = {
	files: File | File[];
	prefix?: string;
};

export type StoreCreateUploadPayload = {
	files: File | File[];
	prefix?: string;
};

export type FileServiceUploadResult = {
	/**
	 * The file's URL.
	 */
	url: string;
	/**
	 * The file's key. This key is used in other operations,
	 * such as deleting a file.
	 */
	key: string;
};

export type StoreUploadRes = {
	uploads: FileServiceUploadResult[];
};

export const useAdminUploadFile = (
	options?: UseMutationOptions<
		Response<AdminUploadsRes>,
		Error,
		AdminCreateUploadPayload
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((payload: AdminCreateUploadPayload) => {
		const _payload = _createPayload(payload);
		return client.admin.custom.post(`/admin/uploads`, _payload);
	}, buildOptions(queryClient, [], options));
};

export const useStoreUploadFile = (
	options?: UseMutationOptions<
		Response<StoreUploadRes>,
		Error,
		StoreCreateUploadPayload
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((payload: StoreCreateUploadPayload) => {
		const _payload = _createPayload(payload);
		const path = `/store/uploads`;

		return client.client.request(
			'POST',
			path,
			_payload,
			{},
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
	}, buildOptions(queryClient, [], options));
};

const _createPayload = (payload: AdminCreateUploadPayload) => {
	const _payload = new FormData();
	const { files, prefix } = payload;
	if (Array.isArray(files)) {
		files.forEach((f) => _payload.append('files', f));
	} else {
		_payload.append('files', files);
	}

	if (prefix) {
		_payload.append('prefix', prefix);
	}

	return _payload;
};
