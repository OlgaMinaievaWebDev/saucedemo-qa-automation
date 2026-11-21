import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  public readonly cartBadge: Locator;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
  }

  async openCart() {
    await this.cartButton.click();
  }
}
