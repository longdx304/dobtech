import { Locator, Page } from '@playwright/test';
import { BasePage } from './base/base-page';

export class ProductPage extends BasePage {
	container: Locator;
	productTitle: Locator;
	productOptions: Locator;
	productPrice: Locator;
	addProductButton: Locator;
	mobileActionsContainer: Locator;
	mobileTitle: Locator;
	mobileActionsButton: Locator;
	mobileAddToCartButton: Locator;

	constructor(page: Page) {
		super(page);

		this.container = page.getByTestId('product-container');
		this.productTitle = this.container.getByTestId('product-title');
		this.productOptions = this.container.getByTestId('product-options');
		this.productPrice = this.container.getByTestId('product-price');
		this.addProductButton = this.container.getByTestId('add-product-button');
		this.mobileActionsContainer = page.getByTestId('mobile-actions');
		this.mobileTitle = this.mobileActionsContainer.getByTestId('mobile-title');
		this.mobileAddToCartButton = this.mobileActionsContainer.getByTestId(
			'mobile-actions-button'
		);
		this.mobileActionsButton = this.mobileActionsContainer.getByTestId(
			'mobile-actions-select'
		);
	}

	async clickAddProduct() {
		await this.addProductButton.click();
		await this.cartDropdown.cartDropdown.first().isVisible();
	}

	async selectOption(option: string) {
		await this.page.mouse.move(0, 0);
		const optionButton = this.productOptions
			.getByTestId('option-button')
			.filter({ hasText: option });
		await optionButton.click({ clickCount: 2 });
	}
}
