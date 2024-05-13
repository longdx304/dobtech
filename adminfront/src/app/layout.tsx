import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getAdmin } from '@/actions/accounts';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';

import theme from '../theme';
import { FeatureFlagProvider } from '@/lib/providers/feature-flag-provider';
import { MedusaProvider } from '@/lib/providers/medusa-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	manifest: '/manifest.json',
};

export default async function RootLayout({
	main,
	login,
	children,
}: Readonly<{
	main?: React.ReactNode;
	login?: React.ReactNode;
	children: React.ReactNode;
}>) {
	// const adminUser = await getAdmin().catch(() => null);

	// let contentToRender;
	// if (adminUser && main) {
	// 	contentToRender = main;
	// } else if (!adminUser && login) {
	// 	contentToRender = login;
	// } else {
	// 	contentToRender = children;
	// }
	return (
		<html lang="en">
			<body className={inter.className}>
				<AntdRegistry>
					<ConfigProvider theme={theme}>
						<MedusaProvider>
							<FeatureFlagProvider>
								{children}
								{/* {login} */}
							</FeatureFlagProvider>
						</MedusaProvider>
					</ConfigProvider>
				</AntdRegistry>
				{/* {children} */}
			</body>
		</html>
	);
}
