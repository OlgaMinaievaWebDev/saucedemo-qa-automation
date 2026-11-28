import { expect } from '@playwright/test';
import { test } from '../fixtures/test-fixtures';
import { loginHelper } from '../helpers/auth';
import { users } from '../test-data/users';
import { parseMoneyToCents } from '../helpers/money';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await loginHelper(page, users.standard.username, users.standard.password);
});

test('SORT-001, Sort product names A to Z', async ({ inventoryPage }) => {
  await inventoryPage.sortDropdown.selectOption('za');
  const originalNames = await inventoryPage.getProductList();
  await inventoryPage.sortDropdown.selectOption('az');
  const expectedNames = [...originalNames].sort((a, b) => a.localeCompare(b));
  await expect(inventoryPage.productNames).toHaveText(expectedNames);
  await expect(inventoryPage.sortDropdown).toHaveValue('az');
});

test('SORT-002, Sort product names Z to A', async ({ inventoryPage }) => {
  await inventoryPage.sortDropdown.selectOption('az');
  const originalNames = await inventoryPage.getProductList();
  const expectedNames = [...originalNames].sort((a, b) => b.localeCompare(a));
  await inventoryPage.sortDropdown.selectOption('za');
  await expect(inventoryPage.productNames).toHaveText(expectedNames);
  await expect(inventoryPage.sortDropdown).toHaveValue('za');
});

test('SORT-003, Sort prices low to high', async ({ inventoryPage }) => {
  await inventoryPage.sortDropdown.selectOption('hilo');
  const originalPrices = await inventoryPage.getProductPrices();
  const integerPrices = originalPrices.map((price) => {
    return parseMoneyToCents(price);
  });
  const sortedPrices = [...integerPrices].sort((a, b) => a - b);
  await inventoryPage.sortDropdown.selectOption('lohi');
  const actualPrices = (await inventoryPage.getProductPrices()).map((price) => {
    return parseMoneyToCents(price);
  });
  expect(actualPrices).toEqual(sortedPrices);
  await expect(inventoryPage.sortDropdown).toHaveValue('lohi');
});

test('SORT-004, Sort prices high to low', async ({ inventoryPage }) => {
  await inventoryPage.sortDropdown.selectOption('lohi');
  const originalPrices = await inventoryPage.getProductPrices();
  const integerPrices = originalPrices.map((price) => {
    return parseMoneyToCents(price);
  });
  const sortedPrices = [...integerPrices].sort((a, b) => b - a);
  await inventoryPage.sortDropdown.selectOption('hilo');
  const actualPrices = (await inventoryPage.getProductPrices()).map((price) => {
    return parseMoneyToCents(price);
  });
  expect(actualPrices).toEqual(sortedPrices);
  await expect(inventoryPage.sortDropdown).toHaveValue('hilo');
});
