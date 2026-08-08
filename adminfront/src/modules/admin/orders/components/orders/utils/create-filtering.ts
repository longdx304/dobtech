// @ts-nocheck
// !check this file
import { ClaimItem, LineItem, Order } from '@medusajs/medusa';

/**
 * Returns all returnable items from an order or a claim.
 * If the order has claims with return orders that are not canceled,
 * the claimed items are subtracted from the order items.
 *
 * @param {Omit<Order, 'beforeInserts'>} order - The order or claim.
 * @param {boolean} isClaim - Whether the order is a claim.
 * @returns {Omit<LineItem, 'beforeInsert'>[]} - The returnable items.
 */
export const getAllReturnableItems = (
	order: Omit<Order, 'beforeInserts'>,
	isClaim: boolean
): Omit<LineItem, 'beforeInsert'>[] => {
	// Initialize the map of order items and claimed items
	const baseItems = Array.isArray(order.items) ? order.items : [];
	let orderItems = baseItems.reduce(
		(map, obj) => map.set(obj.id, { ...obj }),

		new Map<string, Omit<LineItem, 'beforeInsert'>>()
	);

	let claimedItems: ClaimItem[] = [];

	// Process claims
	const claims = Array.isArray(order?.claims) ? order.claims : [];
	if (claims.length) {
		for (const claim of claims) {
			// Skip claims with canceled return orders
			if (claim.return_order?.status !== 'canceled') {
				const claimItems = Array.isArray(claim.claim_items)
					? claim.claim_items
					: [];
				claimedItems = [...claimedItems, ...claimItems];
			}

			// Skip claims with not fulfilled fulfillment status or payment status 'na'
			if (
				claim.fulfillment_status === 'not_fulfilled' &&
				claim.payment_status === 'na'
			) {
				continue;
			}

			// Add additional items to the order items map
			if (Array.isArray(claim?.additional_items)) {
				orderItems = claim.additional_items
					.filter(
						(it: any) =>
							it.shipped_quantity ||
							it.shipped_quantity === it.fulfilled_quantity
					)
					.reduce(
						(map: any, obj: any) => map.set(obj.id, { ...obj }),
						orderItems
					);
			}
		}
	}

	// Process swaps for non-claim orders
	if (!isClaim) {
		const swaps = Array.isArray(order?.swaps) ? order.swaps : [];
		if (swaps.length) {
			for (const swap of swaps) {
				// Skip swaps with not fulfilled fulfillment status
				if (swap.fulfillment_status === 'not_fulfilled') {
					continue;
				}

				// Add additional items to the order items map
				const additionalItems = Array.isArray(swap.additional_items)
					? swap.additional_items
					: [];
				orderItems = additionalItems.reduce(
					(map: any, obj: any) =>
						map.set(obj.id, {
							...obj,
						}),
					orderItems
				);
			}
		}
	}

	// Subtract claimed items from order items
	for (const item of claimedItems) {
		const i = orderItems.get(item.item_id);
		if (i) {
			i.quantity = i.quantity - item.quantity;
			i.quantity !== 0 ? orderItems.set(i.id, i) : orderItems.delete(i.id);
		}
	}

	// Return the returnable items
	return [...orderItems.values()];
};
