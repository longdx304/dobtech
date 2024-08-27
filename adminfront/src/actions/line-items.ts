import Medusa from '@/services/api';

export const updateLineItem = async (lineItemId: string, data: any) => {
	try {
		const lineItem = await Medusa.lineItems.update(lineItemId, data);
		return lineItem.data;
	} catch (error) {
		throw error;
	}
};
