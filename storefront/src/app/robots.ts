import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const siteUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL;

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/checkout',
				'/user/*',
				'/order/confirmed/*',
				'/cart',
				'/search',
				'/search/*',
			],
		},
		sitemap: `${siteUrl}/sitemap_index.xml`,
	};
}
