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

test('LOGIN-001, User can log in with valid credentials', async ({ page }) => {
  await loginHelper(page, 'standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('LOGIN-002, Reject an incorrect password', async ({ page }) => {
  await loginHelper(page, 'standard_user', 'wrong_password');
  await expect(
    page.getByText(
      'Epic sadface: Username and password do not match any user in this service',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('LOGIN-003, Reject a locked-out user', async ({ page }) => {
  await loginHelper(page, 'locked_out_user', 'secret_sauce');
  await expect(
    page.getByText('Epic sadface: Sorry, this user has been locked out.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('LOGIN-004, Validate an empty login form', async ({ page }) => {
  await loginHelper(page, '', '');
  await expect(
    page.getByText('Epic sadface: Username is required', { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('LOGIN-005, Validate a missing password', async ({ page }) => {
  await loginHelper(page, 'standard_user', '');

  await expect(
    page.getByText('Epic sadface: Password is required', { exact: true }),
  ).toBeVisible();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('LOGIN-006, Dismiss a login error', async ({ page }) => {
  await loginHelper(page, '', '');

  const errorMessage = page.getByText('Epic sadface: Username is required');
  await expect(errorMessage).toBeVisible();

  const errorDismissButton = page.getByRole('button', {
    name: 'Dismiss error',
  });
  await expect(errorDismissButton).toBeVisible();
  await errorDismissButton.click();
  await expect(errorDismissButton).not.toBeVisible();

  await expect(errorMessage).not.toBeVisible();

  await expect(
    page.getByPlaceholder('Username', { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('Password', { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Login', exact: true }),
  ).toBeVisible();
});
