import { NextResponse } from 'next/server';
import { getProductsList } from '@/actions/products'; // Adjust path as needed
import { ProductPreviewType } from '@/types/product';

export async function GET() {
	const siteUrl =
		process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:8000';

	try {
		const products = await fetchAllProducts();

		const urls = products.map((product) => ({
			url: `${siteUrl}/products/${product.handle}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'daily', 
		}));

		const sitemapXml = buildSitemap(urls);

		return new NextResponse(sitemapXml, {
			headers: {
				'Content-Type': 'application/xml',
				'Content-Length': Buffer.byteLength(sitemapXml).toString(),
			},
		});
	} catch (error) {
		console.error('Error generating products sitemap:', error);
		return NextResponse.error();
	}
}

async function fetchAllProducts(): Promise<ProductPreviewType[]> {
	let allProducts: ProductPreviewType[] = [];
	let nextPage = 0;
	let hasNextPage = true;

	while (hasNextPage) {
		const { response, nextPage: next } = await getProductsList({
			pageParam: nextPage,
		});
		allProducts = [...allProducts, ...response.products];
		hasNextPage = !!next;
		nextPage = next || 0;
	}

	return allProducts;
}

function buildSitemap(
	urls: { url: string; lastModified: string; changeFrequency: string }[]
): string {
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const { url, lastModified, changeFrequency } of urls) {
		xml += '<url>';
		xml += `<loc>${url}</loc>`;
		xml += `<lastmod>${lastModified}</lastmod>`;
		xml += `<changefreq>${changeFrequency}</changefreq>`;
		xml += '</url>';
	}

	xml += '</urlset>';
	return xml;
}
