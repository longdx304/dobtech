type CustomerWithMetadata = {
	metadata?: Record<string, unknown> | null;
};

export const getCustomerNote = (
	customer?: CustomerWithMetadata | null
): string | undefined => {
	const note = customer?.metadata?.customer_note;

	if (typeof note !== 'string') {
		return undefined;
	}

	const trimmedNote = note.trim();
	return trimmedNote || undefined;
};
