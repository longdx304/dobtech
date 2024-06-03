import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const origin = url.origin;
	const pathname = url.pathname;
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-url", request.url);
	requestHeaders.set("x-pathname", pathname);
	requestHeaders.set("x-origin", origin);

	return NextResponse.next({
		request: {
			// Apply new request headers
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
