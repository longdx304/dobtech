import { test as base } from '@playwright/test';
import { AddressesPage } from './addresses-page';
import { OverviewPage } from './overview-page';
import { ProfilePage } from './profile-page';
import { LoginPage } from './login-page';
import { RegisterPage } from './register-page';

export const accountFixtures = base.extend<{
	accountAddressesPage: AddressesPage;
	accountOverviewPage: OverviewPage;
	accountProfilePage: ProfilePage;
	loginPage: LoginPage;
	registerPage: RegisterPage;
}>({
	accountAddressesPage: async ({ page }, use) => {
		const addressesPage = new AddressesPage(page);
		await use(addressesPage);
	},

	accountOverviewPage: async ({ page }, use) => {
		const overviewPage = new OverviewPage(page);
		await use(overviewPage);
	},
	accountProfilePage: async ({ page }, use) => {
		const profilePage = new ProfilePage(page);
		await use(profilePage);
	},
	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await use(loginPage);
	},
	registerPage: async ({ page }, use) => {
		const registerPage = new RegisterPage(page);
		await use(registerPage);
	},
});
