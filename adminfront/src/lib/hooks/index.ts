import api from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdminDeleteFile() {
	return useMutation(async ({ file_key }: { file_key: string }) => {
		const payload = { fileKey: file_key };

		const response = await api.uploads.delete(payload);
		return response.data;
	});
}
