import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";
import { withStoreConfig } from "./store-config.js";

/** @type {import('next').NextConfig} */
const pwaConfig = {
	disable: false,
	dest: "public",
	// disable: !isProduction,
	runtimeCaching,
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true,
	reloadOnOnline: true,
	fallbacks: {
		// image: "/images/fallback.jpg",
		document: "/offline",
	},
};

const nextConfig = withStoreConfig({
	features: {
		features: {
			search: false,
		},
	},
	staticPageGenerationTimeout: 1000,
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
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
});

export default withPWA(pwaConfig)(nextConfig);
