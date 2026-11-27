import { test as base } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

type MyFixtures = {
  cartPage: CartPage;
  inventoryPage: InventoryPage;
  header: HeaderComponent;
  checkout: CheckoutInformationPage;
  overview: CheckoutOverviewPage;
  complete: CheckoutCompletePage;
};

export const test = base.extend<MyFixtures>({
  cartPage: async ({ page }, use) => {
    const instance = new CartPage(page);
    await use(instance);
  },
  inventoryPage: async ({ page }, use) => {
    const instance = new InventoryPage(page);
    await use(instance);
  },
  header: async ({ page }, use) => {
    const instance = new HeaderComponent(page);
    await use(instance);
  },
  checkout: async ({ page }, use) => {
    const instance = new CheckoutInformationPage(page);
    await use(instance);
  },
  overview: async ({ page }, use) => {
    const instance = new CheckoutOverviewPage(page);
    await use(instance);
  },
  complete: async ({ page }, use) => {
    const instance = new CheckoutCompletePage(page);
    await use(instance);
  },
});
