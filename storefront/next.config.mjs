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
	transpilePackages: [
		'@ant-design',
		'@rc-component',
		'antd',
		'rc-cascader',
		'rc-checkbox',
		'rc-collapse',
		'rc-dialog',
		'rc-drawer',
		'rc-dropdown',
		'rc-field-form',
		'rc-image',
		'rc-input',
		'rc-input-number',
		'rc-mentions',
		'rc-menu',
		'rc-motion',
		'rc-notification',
		'rc-pagination',
		'rc-picker',
		'rc-progress',
		'rc-rate',
		'rc-resize-observer',
		'rc-segmented',
		'rc-select',
		'rc-slider',
		'rc-steps',
		'rc-switch',
		'rc-table',
		'rc-tabs',
		'rc-textarea',
		'rc-tooltip',
		'rc-tree',
		'rc-tree-select',
		'rc-upload',
		'rc-util',
	],
	images: {
		formats: ['image/webp'],
		minimumCacheTTL: 60,
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'dob-ecommerce.s3.ap-southeast-1.amazonaws.com',
				port: '',
				pathname: '/product/**',
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
