export default function generateParams(query: Record<string, any>) {
	const params = Object.keys(query)
		.map((k) => {
			if (query[k] === undefined || query[k] === null || query[k] === '') {
				return '';
			}
			return `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`;
		})
		.join('&');

	return params ? `?${params}` : '';
}
