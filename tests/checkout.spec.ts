import { expect } from '@playwright/test';
import { parseMoneyToCents } from '../helpers/money';
import { test } from '../fixtures/test-fixtures';
import { loginHelper } from '../helpers/auth';
import { products } from '../test-data/products';
import { users } from '../test-data/users';
import { customer } from '../test-data/customer';

const validationCases = [
  {
    testId: 'CHECKOUT-002',
    testDescription: 'Submit an entirely empty customer-information form',
    customerInformation: {
      firstName: '',
      lastName: '',
      postalCode: '',
    },
    validationError: 'Error: First Name is required',
  },
  {
    testId: 'CHECKOUT-004',
    testDescription: 'Submit without a last name',
    customerInformation: {
      ...customer,
      lastName: '',
    },
    validationError: 'Error: Last Name is required',
  },
  {
    testId: 'CHECKOUT-005',
    testDescription: 'Submit without a postal code',
    customerInformation: {
      ...customer,
      postalCode: '',
    },
    validationError: 'Error: Postal Code is required',
  },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await loginHelper(page, users.standard.username, users.standard.password);
});

test('CHECKOUT-001, Complete checkout with one product', async ({
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

test('CHECKOUT-003, Submit without a first name, then correct it', async ({
  page,
  inventoryPage,
  header,
  cartPage,
  checkout,
  overview,
}) => {
  await inventoryPage.addProductToCart(products.backpack.name);
  await header.openCart();
  await expect(page).toHaveURL('/cart.html');
  await cartPage.checkout();
  await expect(page).toHaveURL('/checkout-step-one.html');
  await checkout.fillCustomerInformation({
    firstName: '',
    lastName: customer.lastName,
    postalCode: customer.postalCode,
  });
  await checkout.continueToOverview();
  await expect(checkout.errorMessage).toHaveText(
    'Error: First Name is required',
  );
  await expect(header.cartBadge).toHaveText('1');
  await expect(page).toHaveURL('/checkout-step-one.html');
  await expect(checkout.lastName).toHaveValue(customer.lastName);
  await expect(checkout.postalCode).toHaveValue(customer.postalCode);
  await checkout.fillFirstName(customer.firstName);
  await checkout.continueToOverview();
  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(overview.productRows).toHaveCount(1);
  await expect(
    overview.productRows.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);
  await expect(
    overview.productRows.locator('[data-test="item-quantity"]'),
  ).toHaveText('1');
});

for (const validationCase of validationCases) {
  test(`${validationCase.testId},${validationCase.testDescription}`, async ({
    page,
    inventoryPage,
    cartPage,
    header,
    checkout,
  }) => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await header.openCart();
    await expect(page).toHaveURL('/cart.html');
    await cartPage.checkout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkout.fillCustomerInformation(validationCase.customerInformation);
    await checkout.continueToOverview();
    await expect(checkout.errorMessage).toHaveText(
      validationCase.validationError,
    );
    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(header.cartBadge).toHaveText('1');
  });
}

test('CHECKOUT-006,Review two products and verify order arithmetic', async ({
  page,
  inventoryPage,
  header,
  checkout,
  cartPage,
  overview,
}) => {
  await inventoryPage.addProductToCart(products.backpack.name);
  await inventoryPage.addProductToCart(products.bikeLight.name);
  const backpackPrice = await inventoryPage.getProductPrice(
    products.backpack.name,
  );
  const bikePrice = await inventoryPage.getProductPrice(
    products.bikeLight.name,
  );
  await header.openCart();
  await cartPage.checkout();
  await checkout.fillCustomerInformation(customer);
  await checkout.continueToOverview();
  await expect(overview.productRows).toHaveCount(2);
  await expect(
    overview.productRows.locator('[data-test="item-quantity"]'),
  ).toHaveText(['1', '1']);

  const subtotalCents = parseMoneyToCents(await overview.subtotal.innerText());
  const taxCents = parseMoneyToCents(await overview.tax.innerText());
  const totalCents = parseMoneyToCents(await overview.total.innerText());

  const expectedSubtotalCents =
    parseMoneyToCents(backpackPrice) + parseMoneyToCents(bikePrice);

  expect(subtotalCents).toBe(expectedSubtotalCents);
  expect(totalCents).toBe(subtotalCents + taxCents);

  const backpackRow = overview.getProductRow(products.backpack.name);
  await expect(
    backpackRow.locator('[data-test="inventory-item-name"]'),
  ).toHaveText(products.backpack.name);
  await expect(
    backpackRow.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(backpackPrice);

  const bikeRow = overview.getProductRow(products.bikeLight.name);
  await expect(bikeRow.locator('[data-test="inventory-item-name"]')).toHaveText(
    products.bikeLight.name,
  );
  await expect(
    bikeRow.locator('[data-test="inventory-item-price"]'),
  ).toHaveText(bikePrice);
});

test('CHECKOUT-007,Cancel checkout from the information page', async ({
  page,
  inventoryPage,
  header,
  cartPage,
  checkout,
  complete,
}) => {
  await inventoryPage.addProductToCart(products.backpack.name);
  await header.openCart();
  await cartPage.checkout();
  await expect(page).toHaveURL('/checkout-step-one.html');
  await checkout.cancel();
  await expect(page).toHaveURL('/cart.html');
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
    products.backpack.name,
  );
  await expect(header.cartBadge).toHaveText('1');
  await expect(complete.orderHeading).not.toBeVisible();
});
