import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

/** @type {import('next').NextConfig} */
const pwaConfig = {
	disable: false,
	dest: 'public',
	// disable: !isProduction,
	runtimeCaching,
	register: true,
	skipWaiting: true,
};

const nextConfig = {
	reactStrictMode: true,
	images: {
		// Preview/staging should not consume the production Image Optimization
		// quota. Production keeps Vercel optimization enabled.
		unoptimized: process.env.VERCEL_ENV === 'preview',
		// Product image URLs are immutable uploads. Keep optimized variants long
		// enough to avoid repeated transformations and cache writes.
		minimumCacheTTL: 2678400,
		// The admin only renders fixed thumbnails from 28px to 72px. Keep the
		// useful 1x/2x buckets and avoid producing 16px, 256px, or 384px variants.
		imageSizes: [32, 48, 64, 96, 128, 144],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "staging-api.chamdep.com",
			},
			{
				protocol: "https",
				hostname: "api.chamdep.com",
			},
			{
				protocol: "http",
				hostname: "api.chamdep.com",
			},
			{
				protocol: "https",
				hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "medusa-server-testing.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "dob-ecommerce.s3.ap-southeast-1.amazonaws.com",
			}
		],
	},
	// async redirects() {
	// 	return [
	// 		{
	// 			source: '/',
	// 			destination: '/admin/dashboard',
	// 			permanent: false,
	// 		},
	// 	];
	// },
};

export default withPWA(pwaConfig)(nextConfig);
