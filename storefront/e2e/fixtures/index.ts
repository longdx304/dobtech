import { test as base, Page } from '@playwright/test';
import { resetDatabase } from '../data/reset';
import { CartPage } from './cart-page';
import { CategoryPage } from './category-page';
import { CheckoutPage } from './checkout-page';
import { ProductPage } from './product-page';

export const fixtures = base.extend<{
	resetDatabaseFixture: void;
	cartPage: CartPage;
	categoryPage: CategoryPage;
	checkoutPage: CheckoutPage;
	productPage: ProductPage;
}>({
	page: async ({ page }, use) => {
		await page.goto('/');
		use(page);
	},
	resetDatabaseFixture: [
		async function ({}, use) {
			await resetDatabase();
			await use();
		},
		{ auto: true, timeout: 10000 },
	],
	cartPage: async ({ page }, use) => {
		const cartPage = new CartPage(page);
		await use(cartPage);
	},
	categoryPage: async ({ page }, use) => {
		const categoryPage = new CategoryPage(page);
		await use(categoryPage);
	},
	checkoutPage: async ({ page }, use) => {
		const checkoutPage = new CheckoutPage(page);
		await use(checkoutPage);
	},
	productPage: async ({ page }, use) => {
		const productPage = new ProductPage(page);
		await use(productPage);
	},
});
