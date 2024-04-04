import { getAdmin } from '@/actions/accounts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

import Header from '@/modules/common/components/header';

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const adminUser = await getAdmin().catch(() => null);

	return (
		<main className="bg-[#EFF0F3]">
			<Header />
			{children}
		</main>
	);
}
