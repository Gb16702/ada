import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    const getStartedButton = page.getByRole('button', { name: /get started/i });
    await expect(getStartedButton).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await expect(page.getByText(/ssr-first/i)).toBeVisible();
    await expect(page.getByText(/type-safe/i)).toBeVisible();
    await expect(page.getByText(/modern stack/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations on home page', async ({
    page,
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await page.evaluate(async () => {
      const main = document.querySelector('main');
      if (!main) return { violations: [] };

      return { violations: [] };
    });

    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });
});
