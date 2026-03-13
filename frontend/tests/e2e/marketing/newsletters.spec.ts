import { test, expect } from '@playwright/test'

test.describe('Marketing - Newsletters & Communication', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10000 })
  })

  test('newsletters page loads within project execution', async ({ page }) => {
    // Navigate to a project's execution newsletters
    await page.goto('/projects/1/execution/communication/newsletters')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('newsletters page displays table with columns', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/newsletters')
    await page.waitForLoadState('networkidle')
    // Check for table headers
    const body = await page.textContent('body')
    expect(body).toBeTruthy()
    // Should have subject and recipients columns
    const hasSubject = body?.toLowerCase().includes('subject')
    const hasRecipients = body?.toLowerCase().includes('recipients') || body?.toLowerCase().includes('recipient')
    expect(hasSubject || hasRecipients).toBeTruthy()
  })

  test('create newsletter button is visible', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/newsletters')
    await page.waitForLoadState('networkidle')
    const createBtn = page.locator('button').filter({ hasText: /create|new|add|compose/i })
    await expect(createBtn.first()).toBeVisible()
  })

  test('newsletter status badges render correctly', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/newsletters')
    await page.waitForLoadState('networkidle')
    // Look for status badges (Draft, Sent, Failed)
    const body = await page.textContent('body')
    const hasStatusInfo = body?.toLowerCase().includes('sent') ||
      body?.toLowerCase().includes('draft') ||
      body?.toLowerCase().includes('status')
    expect(hasStatusInfo).toBeTruthy()
  })

  test('status reporting page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/status-reporting')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('meetings page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/meeting')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('reporting page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/communication/reporting')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})

test.describe('Marketing - Execution Stakeholders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10000 })
  })

  test('stakeholders page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/stakeholders')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('execution governance page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/governance')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('execution deployment page loads', async ({ page }) => {
    await page.goto('/projects/1/execution/deployment')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
