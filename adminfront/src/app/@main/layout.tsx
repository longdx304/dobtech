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
		<main className="w-full pt-[4.5rem] sm:pt-0">
			<Header user={adminUser} />
			<article className="sm:w-[calc(100%-200px-4rem)] sm:ml-[200px] sm:pt-4 sm:px-8 md:w-[calc(100%-250px-4rem)] md:ml-[250px]">
				{children}
			</article>
		</main>
	);
}
