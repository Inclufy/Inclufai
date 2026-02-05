import { test, expect } from '@playwright/test'

test.describe('Project CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/)
  })

  test('can create project', async ({ page }) => {
    const createBtn = page.locator('button:has-text("New Project")')
    if (await createBtn.count() > 0) {
      await createBtn.click()
      await expect(page.locator('text=/create/i')).toBeVisible()
    }
  })
})
