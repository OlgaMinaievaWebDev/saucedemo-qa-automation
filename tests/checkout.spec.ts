import { expect } from '@playwright/test';
import { parseMoneyToCents } from '../helpers/money';
import { test } from '../fixtures/test-fixtures';
import { loginHelper } from '../helpers/auth';
import { products } from '../test-data/products';
import { users } from '../test-data/users';
import { customer } from '../test-data/customer';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await loginHelper(page, users.standard.username, users.standard.password);
});

test('CHECKOUT-001 — Complete checkout with one product', async ({
  page,
  inventoryPage,
  cartPage,
  header,
  checkout,
  overview,
  complete,
}) => {
  const backpackPrice = await inventoryPage.getProductPrice(
    products.backpack.name,
  );
  await inventoryPage.addProductToCart(products.backpack.name);
  await expect(header.cartBadge).toHaveText('1');
  await header.openCart();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  const backpackCartItem = cartPage.getCartItem(products.backpack.name);
  await expect(
    backpackCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);
  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
  await expect(
    backpackCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);
  await expect(page).toHaveURL('/cart.html');
  await cartPage.checkout();
  await expect(page).toHaveURL('/checkout-step-one.html');
  await checkout.fillCustomerInformation(customer);
  await checkout.continueToOverview();
  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(overview.productRows).toHaveCount(1);
  await expect(
    overview.productRows.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
  await expect(
    overview.productRows.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);
  await expect(
    overview.productRows.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);

  const subtotalText = await overview.subtotal.innerText();
  const taxText = await overview.tax.innerText();
  const totalText = await overview.total.innerText();

  const subtotalCents = parseMoneyToCents(subtotalText);
  const taxCents = parseMoneyToCents(taxText);
  const totalCents = parseMoneyToCents(totalText);

  expect(subtotalCents).toBe(parseMoneyToCents(backpackPrice));
  expect(totalCents).toBe(subtotalCents + taxCents);

  await expect(overview.paymentLabel).toBeVisible();
  await expect(overview.paymentInformation).toHaveText('SauceCard #31337');
  await expect(overview.shippingLabel).toBeVisible();
  await expect(overview.shippingInformation).toHaveText(
    'Free Pony Express Delivery!',
  );
  await expect(complete.orderHeading).toHaveCount(0);
  await overview.finish();
  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(complete.orderHeading).toBeVisible();
  await expect(complete.orderHeading).toHaveText('Thank you for your order!');
  await expect(header.cartBadge).toHaveCount(0);
  await complete.backHome();
  await expect(page).toHaveURL('/inventory.html');
  await header.openCart();
  await expect(page).toHaveURL('/cart.html');
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
});
