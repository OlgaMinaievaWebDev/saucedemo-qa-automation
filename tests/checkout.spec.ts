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
  await page
    .getByRole('button', {
      name: 'checkout',
    })
    .click();
  await expect(page).toHaveURL('/checkout-step-one.html');
  await page.getByPlaceholder('First Name').fill(customer.firstName);
  await page.getByPlaceholder('Last Name').fill(customer.lastName);
  await page.getByPlaceholder('Zip/Postal Code').fill(customer.postalCode);
  await page
    .getByRole('button', {
      name: 'continue',
    })
    .click();
  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
  await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(
    backpackPrice,
  );
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
    products.backpack.name,
  );
  const subtotalText = await page
    .locator('[data-test="subtotal-label"]')
    .innerText();
  const taxText = await page.locator('[data-test="tax-label"]').innerText();
  const totalText = await page.locator('[data-test="total-label"]').innerText();

  const subtotalCents = parseMoneyToCents(subtotalText);
  const taxCents = parseMoneyToCents(taxText);
  const totalCents = parseMoneyToCents(totalText);

  expect(subtotalCents).toBe(parseMoneyToCents(backpackPrice));
  expect(totalCents).toBe(subtotalCents + taxCents);

  await expect(
    page.getByText('Payment Information:', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('SauceCard #31337', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Shipping Information:', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Free Pony Express Delivery!', { exact: true }),
  ).toBeVisible();

  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(
    page.getByRole('heading', {
      name: 'Thank you for your order!',
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole('button', {
      name: 'finish',
    })
    .click();
  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(
    page.getByRole('heading', {
      name: 'Thank you for your order!',
      exact: true,
    }),
  ).toBeVisible();
  await expect(header.cartBadge).toHaveCount(0);
  await page.getByRole('button', { name: 'back home' }).click();
  await expect(page).toHaveURL('/inventory.html');
  await header.openCart();
  await expect(page).toHaveURL('/cart.html');
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
});
