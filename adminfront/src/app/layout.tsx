import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getAdmin } from '@/applications/accounts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	manifest: "/manifest.json",
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
			<body className={inter.className}>{adminUser ? main : login}</body>
		</html>
	);
}
