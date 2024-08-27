import { test, expect } from "../../index"

test.describe("Login Page functionality", async () => {
  test("access login page from nav menu and submit (partially) empty form", async ({
    loginPage,
  }) => {
    await loginPage.accountDropdown.hover();
		await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
    await loginPage.signInButton.click()
    await expect(loginPage.emailInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);

    await loginPage.emailInput.fill("test-dne@example.com")
    await loginPage.signInButton.click()
    await expect(loginPage.passwordInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
  })

  test("enter incorrect creds and verify error message", async ({
    loginPage,
  }) => {
    await loginPage.accountDropdown.hover();
    await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
    await loginPage.emailInput.fill("test-dne@example.com")
    await loginPage.passwordInput.fill("password")
    await loginPage.signInButton.click()
    await expect(loginPage.errorMessage).toBeVisible()
  })

  test("enter different incorrect creds and verify error message", async ({
    loginPage,
  }) => {
    await loginPage.accountDropdown.hover();
    await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
    await loginPage.emailInput.fill("test@example.com")
    await loginPage.passwordInput.fill("passwrong")
    await loginPage.signInButton.click()
    await expect(loginPage.errorMessage).toBeVisible()
  })

  test("successful login redirects to account page", async ({
    accountOverviewPage,
    loginPage,
  }) => {
    await loginPage.accountDropdown.hover();
    await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
    await loginPage.emailInput.fill("test@example.com")
    await loginPage.passwordInput.fill("password")
    await loginPage.signInButton.click()
    await expect(accountOverviewPage.welcomeMessage).toBeVisible()
  })

  test("logging out works correctly", async ({
    page,
    accountOverviewPage,
    loginPage,
  }) => {
    await loginPage.accountDropdown.hover();
    await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
    await loginPage.emailInput.fill("test@example.com")
    await loginPage.passwordInput.fill("password")
    await loginPage.signInButton.click()
    await expect(accountOverviewPage.welcomeMessage).toBeVisible()

    await accountOverviewPage.logoutLink.highlight()
    await accountOverviewPage.logoutLink.click()
    await loginPage.container.isVisible()

    await loginPage.accountDropdown.hover();
    await loginPage.page.waitForTimeout(500);
    await loginPage.accountLink.click()
    await loginPage.container.isVisible()
  })
})
