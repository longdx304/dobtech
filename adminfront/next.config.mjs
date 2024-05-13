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
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
	async redirects() {
		return [
			{
				source: '/',
				destination: '/login',
				permanent: false,
			},
		];
	},
};

export default withPWA(pwaConfig)(nextConfig);
