import { BACKEND_URL } from '@/lib/constants/medusa-backend-url';

/**
 * Aligns uploaded/asset URLs with the public API protocol (NEXT_PUBLIC_BACKEND_URL).
 * When the Medusa server was configured with BACKEND_URL=http://... but the app uses https://...,
 * stored URLs can still be http and break next/image remote patterns or mixed content.
 */
export function normalizeMedusaAssetUrl(src: string): string {
	if (
		!src ||
		src.startsWith('/') ||
		src.startsWith('blob:') ||
		src.startsWith('data:')
	) {
		return src;
	}
	if (!src.startsWith('http')) {
		return src;
	}

	let backend: URL;
	try {
		backend = new URL(BACKEND_URL);
	} catch {
		return src;
	}

	if (backend.protocol !== 'https:') {
		return src;
	}

	try {
		const asset = new URL(src);
		if (
			asset.protocol === 'http:' &&
			asset.hostname.toLowerCase() === backend.hostname.toLowerCase()
		) {
			asset.protocol = 'https:';
			return asset.toString();
		}
	} catch {
		return src;
	}

	return src;
}
