import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('loads login page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ProjeXtPal/i)
  })

  test('can login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10000 })
  })
})
