import axios from 'axios';

export const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000';

const client = axios.create({ baseURL: BACKEND_URL });

export default function medusaRequest(method, path = '', payload = {}) {
	const options = {
		method,
		withCredentials: true,
		url: path,
		data: payload,
		json: true,
	};
	return client(options);
}
