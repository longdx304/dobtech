import React from 'react';
import { UserProvider } from '@/lib/providers/user-provider';

import Header from '@/modules/common/components/header';
import { PollingProvider } from '@/lib/providers/polling-provider';
import { ImportRefresh } from '@/lib/providers/import-refresh';
import Notification from '@/modules/common/components/notification';

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="w-full pt-[4.5rem] sm:pt-0">
			<UserProvider>
				<PollingProvider>
					<ImportRefresh>
						<Header />
						<Notification />
						<article className="sm:w-[calc(100%-200px-4rem)] sm:ml-[200px] sm:pt-4 sm:px-8 md:w-[calc(100%-250px-4rem)] md:ml-[250px]">
							{children}
						</article>
					</ImportRefresh>
				</PollingProvider>
			</UserProvider>
		</main>
	);
}
