import type { Page } from '@playwright/test';

export const loginHelper = async (page: Page, userName: string, password: string) => {
  await page.getByPlaceholder('Username', { exact: true }).fill(userName);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
};

