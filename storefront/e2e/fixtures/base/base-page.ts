import { CartDropdown } from "./cart-dropdown"
import { NavMenu } from "./nav-menu"
import { Page, Locator } from "@playwright/test"

export class BasePage {
  page: Page
  navMenu: NavMenu
  cartDropdown: CartDropdown
  accountDropdown: Locator
  accountLink: Locator
  cartLink: Locator
  searchLink: Locator
  storeLink: Locator
  categoriesList: Locator

  constructor(page: Page) {
    this.page = page
    this.navMenu = new NavMenu(page)
    this.cartDropdown = new CartDropdown(page)
    this.accountDropdown = page.getByTestId("nav-account-dropdown")
    this.accountLink = page.getByTestId("nav-account-link")
    this.cartLink = page.getByTestId("nav-cart-link")
    this.storeLink = page.getByTestId("nav-store-link")
    this.searchLink = page.getByTestId("nav-search-link")
    this.categoriesList = page.getByTestId("footer-categories")
  }

  async clickCategoryLink(category: string) {
    const link = this.categoriesList.getByTestId("category-link")
    await link.click()
  }
}
