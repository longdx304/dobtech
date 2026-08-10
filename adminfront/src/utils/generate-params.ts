export default function generateParams(query: Record<string, any>) {
	const entries: string[] = [];

	const append = (key: string, value: unknown) => {
		if (value === undefined || value === null || value === '') return;

		if (value instanceof Date) {
			entries.push(
				`${encodeURIComponent(key)}=${encodeURIComponent(value.toISOString())}`
			);
			return;
		}

		if (typeof value === 'object' && !Array.isArray(value)) {
			Object.entries(value).forEach(([nestedKey, nestedValue]) =>
				append(`${key}[${nestedKey}]`, nestedValue)
			);
			return;
		}

		entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
	};

	Object.entries(query).forEach(([key, value]) => append(key, value));
	const params = entries.join('&');

	return params ? `?${params}` : '';
}
