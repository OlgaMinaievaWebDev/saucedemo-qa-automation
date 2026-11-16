import { test, expect } from '@playwright/test';
import { loginHelper } from '../helpers/auth';
import { users, invalidCredentials } from '../test-data/users';

test.describe('Login functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('LOGIN-001, User can log in with valid credentials', async ({
    page,
  }) => {
    await loginHelper(page, users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('LOGIN-002, Reject an incorrect password', async ({ page }) => {
    await loginHelper(
      page,
      users.standard.username,
      invalidCredentials.wrongPassword,
    );
    await expect(
      page.getByText(
        'Epic sadface: Username and password do not match any user in this service',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('LOGIN-003, Reject a locked-out user', async ({ page }) => {
    await loginHelper(page, users.locked.username, users.locked.password);
    await expect(
      page.getByText('Epic sadface: Sorry, this user has been locked out.', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('LOGIN-004, Validate an empty login form', async ({ page }) => {
    await loginHelper(page, '', '');
    await expect(
      page.getByText('Epic sadface: Username is required', { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('LOGIN-005, Validate a missing password', async ({ page }) => {
    await loginHelper(page, users.standard.username, '');

    await expect(
      page.getByText('Epic sadface: Password is required', { exact: true }),
    ).toBeVisible();

    await expect(page).toHaveURL('/');
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

  test('LOGIN-007, Reject login with an empty username and populated password', async ({
    page,
  }) => {
    await loginHelper(page, '', users.standard.password);
    await expect(
      page.getByText('Epic sadface: Username is required'),
    ).toBeVisible();
    await expect(page).toHaveURL('/');
  });
});
