import type { Locator, Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly card: Locator;
  constructor(page: Page) {
    this.page = page;
    this.card = page.locator('[data-test="inventory-item"]');
  }

  getCartItem(productName: string): Locator {
    return this.card.filter({ hasText: productName });
  }
  async removeProduct(productName: string) {
    const cartItem = this.getCartItem(productName);
    await cartItem
      .getByRole('button', {
        name: 'remove',
      })
      .click();
  }

  async continueShopping() {
    await this.page
      .getByRole('button', {
        name: 'Continue Shopping',
      })
      .click();
  }

  async checkout() {
    await this.page
      .getByRole('button', {
        name: 'checkout',
      })
      .click();
  }
}
