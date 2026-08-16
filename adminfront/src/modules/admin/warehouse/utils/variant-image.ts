const DEFAULT_PRODUCT_IMAGE = '/images/product-img.png';

type VariantImage = {
	image_url?: unknown;
	variant_value?: unknown;
};

type LineItemWithVariantImage = {
	thumbnail?: string | null;
	variant?: {
		title?: string | null;
		product?: {
			thumbnail?: string | null;
			metadata?: Record<string, unknown> | null;
		} | null;
	} | null;
};

const parseVariantImages = (value: unknown): VariantImage[] => {
	if (Array.isArray(value)) return value;
	if (typeof value !== 'string' || !value.trim()) return [];

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const getLineItemVariantImage = (
	item: LineItemWithVariantImage
): string => {
	const variantTitle = item.variant?.title;
	const variantImages = parseVariantImages(
		item.variant?.product?.metadata?.variant_images
	);
	const mappedImage = variantImages.find(
		(image) =>
			typeof image.variant_value === 'string' &&
			image.variant_value === variantTitle &&
			typeof image.image_url === 'string' &&
			image.image_url.length > 0
	);

	if (typeof mappedImage?.image_url === 'string') {
		return mappedImage.image_url;
	}

	return (
		item.thumbnail ||
		item.variant?.product?.thumbnail ||
		DEFAULT_PRODUCT_IMAGE
	);
};
