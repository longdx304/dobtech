import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getAdmin } from '@/actions/accounts';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import theme from '../theme';
import { ConfigProvider } from 'antd';

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
}>) {
	const adminUser = await getAdmin().catch(() => null);

	return (
		<html lang="en">
			<body className={inter.className}>
				<AntdRegistry>
					<ConfigProvider theme={theme}>
						{adminUser ? main : login}
					</ConfigProvider>
				</AntdRegistry>
				{children}
			</body>
		</html>
	);
}
