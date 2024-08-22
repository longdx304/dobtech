import { test, expect } from '../../index';

test.describe('User registration functionality', async () => {
	test('registration with existing user shows error message', async ({
		loginPage,
		registerPage,
	}) => {
		await loginPage.accountDropdown.hover();
		await loginPage.page.waitForTimeout(500);
		await loginPage.accountLink.click();
		await registerPage.container.isVisible();
		await loginPage.registerButton.click();

		await registerPage.firstNameInput.fill('first');
		await registerPage.lastNameInput.fill('last');
		await registerPage.emailInput.fill('test@example.com');
		await registerPage.phoneInput.fill('0329123657');
		await registerPage.passwordInput.fill('password');
		await registerPage.registerButton.click();

		await expect(registerPage.registerError).toBeVisible({ timeout: 3000 });
	});

	test('registration with empty form data highlights corresponding input', async ({
		accountOverviewPage,
		loginPage,
		registerPage,
	}) => {
    await loginPage.accountDropdown.hover();
		await loginPage.page.waitForTimeout(500);
		await loginPage.accountLink.click();
		await registerPage.container.isVisible();
		await loginPage.registerButton.click();

		await registerPage.registerButton.click();
		await expect(registerPage.firstNameInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		await registerPage.firstNameInput.fill('first');

		await registerPage.registerButton.click();
		await expect(registerPage.lastNameInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		await registerPage.lastNameInput.fill('last');

		await registerPage.registerButton.click();
		await expect(registerPage.emailInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		await registerPage.emailInput.fill('test-reg-new@example.com');

		await registerPage.registerButton.click();
		await expect(registerPage.phoneInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		await registerPage.phoneInput.fill('0329123657');

		await registerPage.registerButton.click();
		await expect(registerPage.passwordInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		await registerPage.passwordInput.fill('password');

		await registerPage.registerButton.click();

		await registerPage.page.waitForTimeout(100);
		await expect(accountOverviewPage.welcomeMessage).toBeVisible();
	});

	test('successful registration and navigation to account overview', async ({
		loginPage,
		registerPage,
		accountOverviewPage,
	}) => {
    await loginPage.accountDropdown.hover();
		await loginPage.page.waitForTimeout(500);
		await loginPage.accountLink.click();
		await registerPage.container.isVisible();
		await loginPage.registerButton.click();

		await registerPage.firstNameInput.fill('first');
		await registerPage.lastNameInput.fill('last');
		await registerPage.emailInput.fill('test-reg@example.com');
		await registerPage.phoneInput.fill('0329123657');
		await registerPage.passwordInput.fill('password');
		await registerPage.registerButton.click();
		await expect(accountOverviewPage.welcomeMessage).toBeVisible();
	});
});
