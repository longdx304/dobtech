import { NextResponse } from 'next/server';

export async function GET() {
	const siteUrl =
		process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:8000';

	try {
		const sitemaps = [
			`${siteUrl}/sitemap_products.xml`,
			`${siteUrl}/sitemap_categories.xml`,
		];

		const sitemapIndexXML = await buildSitemapIndex(sitemaps);

		return new NextResponse(sitemapIndexXML, {
			headers: {
				'Content-Type': 'application/xml',
				'Content-Length': Buffer.byteLength(sitemapIndexXML).toString(),
			},
		});
	} catch (error) {
		console.error('Error generating sitemap index:', error);
		return NextResponse.error();
	}
}

async function buildSitemapIndex(sitemaps: string[]) {
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const sitemapURL of sitemaps) {
		xml += '<sitemap>';
		xml += `<loc>${sitemapURL}</loc>`;
    xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
		xml += '</sitemap>';
	}

	xml += '</sitemapindex>';
	return xml;
}
