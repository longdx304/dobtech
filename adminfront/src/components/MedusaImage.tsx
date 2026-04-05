import NextImage, { ImageProps } from 'next/image';

import { normalizeMedusaAssetUrl } from '@/lib/utils/medusa-asset-url';

function normalizeSrc(src: ImageProps['src']): ImageProps['src'] {
	if (typeof src === 'string') {
		return normalizeMedusaAssetUrl(src);
	}
	return src;
}

/** next/image with src rewritten to HTTPS when it matches NEXT_PUBLIC_BACKEND_URL. */
export function MedusaImage({ src, ...props }: ImageProps) {
	return <NextImage src={normalizeSrc(src)} {...props} />;
}
