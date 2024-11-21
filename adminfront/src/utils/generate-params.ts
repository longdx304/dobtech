export default function generateParams(search: Record<string, any>) {
	const params = Object.keys(search)
		.map((k) => `${k}=${search[k]}`)
		.join('&');

	return params ? `?${params}` : '';
}
