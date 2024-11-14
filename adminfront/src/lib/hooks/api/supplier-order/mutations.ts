import { MarkAsFulfilledReq, MarkAsFulfilledRes } from '@/types/supplier';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';

export const useMarkAsFulfilledMutation = (
	id: string,
	options?:
		| UseMutationOptions<MarkAsFulfilledRes, Error, MarkAsFulfilledReq, unknown>
		| undefined
) => {
	const { client } = useMedusa();

	return useMutation(
		(status: MarkAsFulfilledReq) => client.admin.custom.post('api', status),
		options
	);
};
