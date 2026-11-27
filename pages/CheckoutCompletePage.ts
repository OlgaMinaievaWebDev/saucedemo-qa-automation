import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly orderHeading: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.orderHeading = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
