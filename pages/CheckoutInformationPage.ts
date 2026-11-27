import type { Locator, Page } from '@playwright/test';
interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}
export class CheckoutInformationPage {
  readonly page: Page;
  public readonly firstName: Locator;
  public readonly lastName: Locator;
  public readonly postalCode: Locator;
  public readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillCustomerInformation(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async fillFirstName(value: string): Promise<void> {
    await this.firstName.fill(value);
  }

  async continueToOverview() {
    await this.page.getByRole('button', { name: 'continue' }).click();
  }
}
