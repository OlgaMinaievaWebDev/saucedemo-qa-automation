import type { Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  private readonly finishButton: Locator;
  readonly productRows: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly paymentLabel: Locator;
  readonly paymentInformation: Locator;
  readonly shippingLabel: Locator;
  readonly shippingInformation: Locator;

  constructor(page: Page) {
    this.finishButton = page.locator('[data-test="finish"]');
    this.productRows = page.locator('[data-test="inventory-item"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.paymentLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInformation = page.locator('[data-test="payment-info-value"]');
    this.shippingLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
