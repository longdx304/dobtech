import NextImage, { ImageProps } from 'next/image';

import { normalizeMedusaAssetUrl } from '@/lib/utils/medusa-asset-url';

function normalizeSrc(src: ImageProps['src']): ImageProps['src'] {
	if (typeof src === 'string') {
		return normalizeMedusaAssetUrl(src);
	}
	return src;
}

/** next/image with src rewritten to HTTPS when it matches NEXT_PUBLIC_BACKEND_URL. */
export function MedusaImage({
	src,
	unoptimized,
	quality = 70,
	...props
}: ImageProps) {
	const normalizedSrc = normalizeSrc(src);
	const isSmallLocalAsset =
		typeof normalizedSrc === 'string' && normalizedSrc.startsWith('/images/');

	return (
		<NextImage
			src={normalizedSrc}
			unoptimized={unoptimized ?? isSmallLocalAsset}
			quality={quality}
			{...props}
		/>
	);
}
