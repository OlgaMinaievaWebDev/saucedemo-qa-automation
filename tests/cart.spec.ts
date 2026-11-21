import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { HeaderComponent } from '../components/HeaderComponent';
import { loginHelper } from '../helpers/auth';
import { users } from '../test-data/users';
import { products } from '../test-data/products';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await loginHelper(page, users.standard.username, users.standard.password);
});

test('CART-001, Add one product and open the cart', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  const backpackPrice = await inventoryPage.getProductPrice(
    products.backpack.name,
  );
  await inventoryPage.addProductToCart(products.backpack.name);

  await expect(header.cartBadge).toHaveText('1');
  await header.openCart();

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

  await expect(
    backpackCartItem.getByRole('button', { name: 'Remove' }),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/cart\.html$/);
});

test('CART-002,Add two different products', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  const backpackPrice = await inventoryPage.getProductPrice(
    products.backpack.name,
  );

  await inventoryPage.addProductToCart(products.backpack.name);

  const bikeLightPrice = await inventoryPage.getProductPrice(
    products.bikeLight.name,
  );

  await inventoryPage.addProductToCart(products.bikeLight.name);

  await expect(header.cartBadge).toHaveText('2');

  await header.openCart();

  const backpackCartItem = cartPage.getCartItem(products.backpack.name);

  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');

  await expect(
    backpackCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);

  await expect(
    backpackCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);

  const bikeLightCartItem = cartPage.getCartItem(products.bikeLight.name);

  await expect(
    bikeLightCartItem.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(bikeLightPrice);

  await expect(
    bikeLightCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
  await expect(
    bikeLightCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.bikeLight.name);

  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);

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
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  await inventoryPage.addProductToCart(products.backpack.name);
  await inventoryPage.addProductToCart(products.bikeLight.name);

  await expect(header.cartBadge).toHaveText('2');

  await header.openCart();

  const backpackCardItem = cartPage.getCartItem(products.backpack.name);

  const bikeCardItem = cartPage.getCartItem(products.bikeLight.name);

  await cartPage.removeProduct(products.backpack.name);

  await expect(backpackCardItem).toHaveCount(0);
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  await expect(bikeCardItem).toHaveCount(1);
  await expect(bikeCardItem.locator('[data-test="item-quantity"]')).toHaveText(
    '1',
  );
  await expect(header.cartBadge).toHaveText('1');
});

test('CART-004,Remove the last cart item', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  await inventoryPage.addProductToCart(products.bikeLight.name);
  await expect(header.cartBadge).toHaveText('1');
  await header.openCart();

  const bikeCartItem = cartPage.getCartItem(products.bikeLight.name);
  await expect(
    bikeCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.bikeLight.name);

  await cartPage.removeProduct(products.bikeLight.name);

  await expect(bikeCartItem).toHaveCount(0);

  await expect(header.cartBadge).toHaveCount(0);
  await expect(page).toHaveURL('/cart.html');
});

test('CART-005,Return to Products and reopen a populated cart', async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  const backpackCard = inventoryPage.getProductCard(products.backpack.name);
  await inventoryPage.addProductToCart(products.backpack.name);
  await expect(header.cartBadge).toHaveText('1');
  await header.openCart();
  const backpackCartItem = cartPage.getCartItem(products.backpack.name);
  await expect(
    backpackCartItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);
  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
  await cartPage.continueShopping();
  await expect(page).toHaveURL('/inventory.html');
  await expect(backpackCard.getByRole('button', { name: 'remove' })).toHaveText(
    'Remove',
  );
  await expect(header.cartBadge).toHaveText('1');
  await header.openCart();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  await expect(backpackCartItem).toHaveCount(1);
  await expect(
    backpackCartItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
});

test('CART-006,Inspect quantity and duplicate-add controls', async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const header = new HeaderComponent(page);
  await inventoryPage.addProductToCart(products.backpack.name);
  await expect(header.cartBadge).toHaveText('1');
  const backpackCard = inventoryPage.getProductCard(products.backpack.name);
  await expect(backpackCard.getByRole('button', { name: 'remove' })).toHaveText(
    'Remove',
  );
  await expect(
    backpackCard.getByRole('button', { name: 'add to cart' }),
  ).not.toBeVisible();
  await header.openCart();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  const backpackCardItem = cartPage.getCartItem(products.backpack.name);
  await expect(
    backpackCardItem.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
  await expect(
    backpackCardItem.locator(
      'input, textarea, select, [contenteditable="true"]',
    ),
  ).toHaveCount(0);
  await expect(
    backpackCardItem.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);

  await expect(
    backpackCardItem.getByRole('button', { name: 'Remove' }),
  ).toBeVisible();
  await backpackCardItem.locator('[data-test="inventory-item-name"]').click();
  await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);

  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
    products.backpack.name,
  );

  await expect(page.locator('[data-test="remove"]')).toHaveText('Remove');
  await expect(
    page.getByRole('button', { name: 'Add to cart', exact: true }),
  ).toHaveCount(0);
  await expect(header.cartBadge).toHaveText('1');
});
