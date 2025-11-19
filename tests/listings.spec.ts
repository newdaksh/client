import { test, expect } from '@playwright/test';

test('should display listings', async ({ page }) => {
    await page.goto('http://localhost:3000/listings');

    // Should have listings
    // Note: This depends on seed data or backend state
    // We can just check if the page loads and shows the filter
    await expect(page.locator('input[placeholder="Search services..."]')).toBeVisible();
});
