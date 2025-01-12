import { baseUrl } from '../../utils';
import { expect, test } from '@playwright/test';

test('Connectors without a trigger get filters out of browse when filter is set to browse', async ({ page }) => {
  await page.goto(baseUrl);

  await page.locator('div[role="button"]:has-text("🧰")').click();
  await page.locator('text=Select an option').click();

  await page.locator('button[role="option"]:has-text("Empty/New")').click();
  await page.locator('div[role="button"]:has-text("🧰")').click();
  await page.getByTestId('card-Add a trigger').getByRole('button', { name: 'Add a trigger' }).click();

  await expect(page.locator('role=button[name="SFTP SFTP In App"]')).toHaveCount(1);
  await expect(page.locator('role=button[name="Control Control In App"]')).toHaveCount(0);
});

test('Connectors without a trigger are shown when filter is off', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('div[role="button"]:has-text("🧰")').click();
  await page.locator('text=Select an option').click();

  await page.locator('button[role="option"]:has-text("Simple Big Workflow")').click();
  await page.locator('div[role="button"]:has-text("🧰")').click();
  await page.getByRole('button', { name: 'Insert a new step between Get_rows and Response' }).click();
  await page.getByRole('button', { name: 'Add an action' }).click();

  await expect(page.locator('role=button[name="SFTP SFTP In App"]')).toHaveCount(1);
  await expect(page.locator('role=button[name="Control Control In App"]')).toHaveCount(1);
});
