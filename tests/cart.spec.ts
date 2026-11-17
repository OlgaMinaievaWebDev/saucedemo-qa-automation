import { test, expect } from '@playwright/test';
import { loginHelper } from '../helpers/auth';
import { users } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await loginHelper(page, users.standard.username, users.standard.password);
});

test('CART-001, Add one product and open the cart', async ({ page }) => {
  const backpackCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  const backpackPrice = await backpackCard
    .locator('[data-test="inventory-item-price"]')
    .innerText();

  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    '1',
  );

  await page.locator('[data-test="shopping-cart-link"]').click();

  const backpackCartItem = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await expect(
    backpackCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText('Sauce Labs Backpack');

  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');

  await expect(
    backpackCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);

  await expect(
    backpackCartItem.getByRole('button', { name: 'Remove' }),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/cart\.html$/);
});

test('CART-002,Add two different products', async ({ page }) => {
  const backpackCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  const backpackPrice = await backpackCard
    .locator('[data-test="inventory-item-price"]')
    .innerText();

  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();

  const bikeLightCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Bike Light' });

  const bikeLightPrice = await bikeLightCard
    .locator('[data-test="inventory-item-price"]')
    .innerText();

  await bikeLightCard.getByRole('button', { name: 'Add to cart' }).click();

  await expect(
    page.getByRole('button', { name: /^Cart, 2 items?$/i }),
  ).toBeVisible();

  await page.locator('[data-test="shopping-cart-link"]').click();

  const backpackCartItem = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');

  await expect(
    backpackCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);

  const bikeLightCartItem = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Bike Light ' });

  await expect(
    bikeLightCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(bikeLightPrice);

  await expect(
    bikeLightCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');

  await expect(
    page.locator('[data-test="remove-sauce-labs-backpack"]'),
  ).toHaveText('Remove');
  await expect(
    page.locator('[data-test="remove-sauce-labs-bike-light"]'),
  ).toHaveText('Remove');
});

test('CART-003, Remove one product from a cart with two items', async ({
  page,
}) => {
  const backpackCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    '1',
  );

  const bikeCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Bike Light' });

  await bikeCard.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    '2',
  );

  await page.locator('[data-test="shopping-cart-link"]').click();

  const backpackCardItem = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  const bikeCardItem = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Bike Light' });

  await backpackCardItem.getByRole('button', { name: 'remove' }).click();

  await expect(backpackCardItem).toHaveCount(0);
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  await expect(bikeCardItem.locator('[data-test="item-quantity"]')).toHaveText(
    '1',
  );
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    '1',
  );
});
