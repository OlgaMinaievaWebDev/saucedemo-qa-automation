import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const loginHelper = async (page: Page, userName: string, password: string) => {
  await page.getByPlaceholder('Username', { exact: true }).fill(userName);

  await page.getByPlaceholder('Password', { exact: true }).fill(password);

  await page.getByRole('button', { name: 'Login' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});

test('LOGIN-001: User can log in with valid credentials', async ({ page }) => {
  await loginHelper(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/\/inventory\.html$/);

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('LOGIN-002 — Reject an incorrect password', async ({ page }) => {
  await loginHelper(page, 'standard_user', 'wrong_password');

  await expect(
    page.getByText(
      'Epic sadface: Username and password do not match any user in this service',
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('LOGIN-003 · Reject a locked-out user', async ({ page }) => {
  await loginHelper(page, 'locked_out_user', 'secret_sauce');

  await expect(
    page.getByText('Epic sadface: Sorry, this user has been locked out.', {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
