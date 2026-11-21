import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly card: Locator;

  constructor(page: Page) {
    this.page = page;
    this.card = page.locator('[data-test="inventory-item"]');
  }

  getProductCard(productName: string): Locator {
    return this.card.filter({ hasText: productName });
  }

  async addProductToCart(productName: string) {
    const productCard = this.getProductCard(productName);
    await productCard
      .getByRole('button', {
        name: 'add to cart',
      })
      .click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const productCard = this.getProductCard(productName);
    return await productCard
      .locator('[data-test="inventory-item-price"]')
      .innerText();
  }
}
