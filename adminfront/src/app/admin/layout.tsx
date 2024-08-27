import React from 'react';
import { UserProvider } from '@/lib/providers/user-provider';

import Header from '@/modules/common/components/header';
import { PollingProvider } from '@/lib/providers/polling-provider';
import { ImportRefresh } from '@/lib/providers/import-refresh';
import { FeatureFlagProvider } from '@/lib/providers/feature-flag-provider';
import Notification from '@/modules/common/components/notification';
import { LayeredModalProvider } from '@/lib/providers/layer-modal-provider';

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="w-full pt-[4.5rem] sm:pt-0">
			<UserProvider>
				<FeatureFlagProvider>
					<PollingProvider>
						<ImportRefresh>
							<LayeredModalProvider>
								<Header />
								<Notification />
								<article className="sm:w-[calc(100%-200px-4rem)] sm:ml-[200px] sm:pt-4 sm:px-8 md:w-[calc(100%-250px-4rem)] md:ml-[250px]">
									{children}
								</article>
							</LayeredModalProvider>
						</ImportRefresh>
					</PollingProvider>
				</FeatureFlagProvider>
			</UserProvider>
		</main>
	);
}
