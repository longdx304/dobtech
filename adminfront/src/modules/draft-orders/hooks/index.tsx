import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';

export const useAdminDraftOrderTransferOrder = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.draftOrders.transferToOrder(id);
			return response.data as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-draft-orders']);
			},
		}
	);
};
