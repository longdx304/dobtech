import { expect } from '@jest/globals';
import { getLineItemVariantImage } from '@/modules/admin/warehouse/utils/variant-image';

describe('warehouse variant image', () => {
	it('uses the image mapped to the current variant', () => {
		expect(
			getLineItemVariantImage({
				thumbnail: 'line-item.jpg',
				variant: {
					title: 'Màu đỏ',
					product: {
						thumbnail: 'product.jpg',
						metadata: {
							variant_images: JSON.stringify([
								{
									variant_value: 'Màu đỏ',
									image_url: 'red-variant.jpg',
								},
							]),
						},
					},
				},
			})
		).toBe('red-variant.jpg');
	});

	it('falls back safely when variant image metadata is invalid', () => {
		expect(
			getLineItemVariantImage({
				thumbnail: 'line-item.jpg',
				variant: {
					title: 'Màu xanh',
					product: {
						thumbnail: 'product.jpg',
						metadata: { variant_images: 'invalid-json' },
					},
				},
			})
		).toBe('line-item.jpg');
	});

	it('uses the default image when no product image is available', () => {
		expect(getLineItemVariantImage({})).toBe('/images/product-img.png');
	});
});
