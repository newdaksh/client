import { test, expect } from '@playwright/test';

test('should allow a user to sign up', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signup');

    await page.fill('input[name="name"]', 'E2E User');
    await page.fill('input[name="email"]', `e2e-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');

    // Select role (optional, defaults to user)
    // await page.selectOption('select[name="role"]', 'user');

    await page.click('button[type="submit"]');

    // Should redirect to home page
    await expect(page).toHaveURL('http://localhost:3000/');

    // Should show user name in navbar
    await expect(page.locator('nav')).toContainText('Hello, E2E User');
});
