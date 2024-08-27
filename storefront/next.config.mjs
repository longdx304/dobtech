import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
import { withStoreConfig } from './store-config.js';
import withBundleAnalyzer from '@next/bundle-analyzer';
import withPlugins from 'next-compose-plugins';
import withLess from 'next-with-less';

/** @type {import('next').NextConfig} */
const pwaConfig = {
	disable: false,
	dest: 'public',
	runtimeCaching,
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true,
	reloadOnOnline: true,
	fallbacks: {
		document: '/offline',
	},
};

const analyzerConfig = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

const lessConfig = [
	withLess,
	{
		lessLoaderOptions: {
			lessOptions: {
				javascriptEnabled: true,
			},
		},
	},
];

const nextConfig = withStoreConfig({
	features: {
		features: {
			search: false,
		},
	},
	experimental: {
		optimizePackageImports: ['lucide-react', 'lodash', 'antd'],
	},
	serverExternalPackages: ['playwright'],
	staticPageGenerationTimeout: 1000,
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
	optimizeFonts: true,
	compress: true,
	swcMinify: true,
	postcss: true,
	images: {
		unoptimized: true,
		formats: ['image/avif', 'image/webp'],
		domains: ['dob-ecommerce.s3.ap-southeast-1.amazonaws.com'],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
			},
			{
				protocol: 'https',
				hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'medusa-server-testing.s3.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'dob-ecommerce.s3.ap-southeast-1.amazonaws.com',
			},
		],
	},
	webpack: (config, { dev, isServer }) => {
		// Enable usedExports optimization in production for client-side code
		if (!dev && !isServer) {
			config.optimization.usedExports = true;
		}

		// Add warning suppression for formidable
		config.ignoreWarnings = [
			{ module: /node_modules\/formidable\/src\/Formidable\.js/ },
			{ file: /node_modules\/formidable\/src\/index\.js/ },
		];
		return config;
	},
});

// Combine all plugins
const plugins = [[withPWA, pwaConfig], analyzerConfig, lessConfig];

// Apply the configuration wrappers using withPlugins
const finalConfig = withPlugins(plugins, nextConfig);

export default finalConfig;
