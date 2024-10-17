import Medusa from '@/services/api';
import { LineItem } from '@medusajs/medusa';

export const updateLineItem = async (lineItemId: string, data: Partial<LineItem>) => {
	try {
		const lineItem = await Medusa.lineItems.update(lineItemId, data);
		return lineItem.data;
	} catch (error) {
		console.log('error line item', error);
		throw error;
	}
};
