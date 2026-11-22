import { test as base } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';

type MyFixtures = {
  cartPage: CartPage;
  inventoryPage: InventoryPage;
  header: HeaderComponent;
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
});
