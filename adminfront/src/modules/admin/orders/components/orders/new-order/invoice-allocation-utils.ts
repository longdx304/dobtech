export type NewOrderInvoicePart = {
	key: string;
	profile_id: string;
	consumer_name?: string;
	consumer_address?: string;
	quantities: Record<string, number>;
};

export type AllocationOrderItem = { variant_id: string; quantity: number };

/** Keep entered parts within each SKU total and put every remainder on the final tax customer. */
export function normalizeInvoiceParts(parts: NewOrderInvoicePart[], items: AllocationOrderItem[]): NewOrderInvoicePart[] {
	const remaining = Object.fromEntries(items.map((item) => [item.variant_id, item.quantity]));
	return parts.map((part, partIndex) => {
		const isLast = partIndex === parts.length - 1;
		const quantities: Record<string, number> = {};
		items.forEach((item) => {
			const available = remaining[item.variant_id] ?? 0;
			const requested = isLast ? available : Math.max(0, Math.floor(Number(part.quantities[item.variant_id] ?? 0)));
			const quantity = Math.min(available, requested);
			quantities[item.variant_id] = quantity;
			remaining[item.variant_id] = available - quantity;
		});
		return { ...part, quantities };
	});
}
