import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get('url');

	if (!url) {
		return NextResponse.json({ error: 'URL is required' }, { status: 400 });
	}

	try {
		// Fetch file from backend (localhost:9000)
		const response = await fetch(url);

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Failed to fetch file from backend' },
				{ status: response.status }
			);
		}

		// Get the blob data
		const blob = await response.blob();
		const buffer = await blob.arrayBuffer();

		// Return the file with appropriate headers
		return new NextResponse(buffer, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'text/csv',
				'Content-Disposition':
					response.headers.get('Content-Disposition') || 'attachment',
				'Cache-Control': 'no-cache',
			},
		});
	} catch (error) {
		console.error('Error downloading file:', error);
		return NextResponse.json(
			{ error: 'Failed to download file' },
			{ status: 500 }
		);
	}
}
