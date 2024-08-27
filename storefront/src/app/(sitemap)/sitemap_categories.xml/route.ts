import { NextResponse } from 'next/server';
import { listCategories } from '@/actions/productCategory'; // Adjust path as needed

export async function GET() {
	const siteUrl =
		process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:8000';

	try {
		const categories = await fetchAllCategories();

		const urls =
			categories?.map((category) => ({
				url: `${siteUrl}/categories/${category.handle}`,
				lastModified: new Date().toISOString(),
				changeFrequency: 'daily',
			})) ?? [];

		return new NextResponse(buildSitemap(urls), {
			headers: {
				'Content-Type': 'application/xml',
				'Content-Length': Buffer.byteLength(buildSitemap(urls)).toString(),
			},
		});
	} catch (error) {
		console.error('Error generating categories sitemap:', error);
		return NextResponse.error();
	}
}

async function fetchAllCategories() {
	// Fetch categories from your data source
	return await listCategories(); // Adjust this based on how you fetch categories
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
