import { getAdmin } from '@/actions/accounts';

import Header from '@/modules/common/components/header';
import { IAdminResponse } from '@/types/account';

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	
	return (
		<main className="w-full pt-[4.5rem] sm:pt-0">
			<Header />
			<article className="sm:w-[calc(100%-200px-4rem)] sm:ml-[200px] sm:pt-4 sm:px-8 md:w-[calc(100%-250px-4rem)] md:ml-[250px]">
				{children}
			</article>
		</main>
	);
}
