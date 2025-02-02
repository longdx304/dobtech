/* eslint-disable import/no-anonymous-default-export */
import medusaRequest from './request';

const removeNullish = (obj) =>
	Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});

const buildQueryFromObject = (search, prefix = '') =>
	Object.entries(search)
		.map(([key, value]) =>
			typeof value === 'object'
				? buildQueryFromObject(value, key)
				: `${prefix ? `${prefix}[${key}]` : `${key}`}=${value}`
		)
		.join('&');

export default {};
