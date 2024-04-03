import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getAdmin } from '@/actions/accounts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	manifest: '/manifest.json',
};

export default async function RootLayout({
	main,
	login,
}: Readonly<{
	main?: React.ReactNode;
	login?: React.ReactNode;
}>) {
	const adminUser = await getAdmin().catch(() => null);

	return (
		<html lang="en">
			<body className={inter.className}>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<ThemeProvider theme={theme}>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						{adminUser ? main : login}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
