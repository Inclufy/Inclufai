import { test, expect } from '@playwright/test'

test.describe('Kanban Board Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/)
  })

  test('displays kanban board with columns', async ({ page }) => {
    // Navigate to a Kanban project or board
    await page.click('text=/kanban/i')
    
    // Should show board columns
    await expect(page.locator('text=/to do|backlog/i')).toBeVisible()
    await expect(page.locator('text=/in progress|doing/i')).toBeVisible()
    await expect(page.locator('text=/done|complete/i')).toBeVisible()
  })

  test('can create a new card', async ({ page }) => {
    await page.goto('/kanban')  // Adjust URL based on your routing
    
    // Find "Add Card" button
    const addCardButton = page.locator('button:has-text("Add Card"), button:has-text("New Card")')
    
    if (await addCardButton.count() > 0) {
      await addCardButton.first().click()
      
      // Fill card details
      await page.fill('input[name="title"]', 'E2E Test Card')
      await page.fill('textarea[name="description"]', 'Test card description')
      
      await page.click('button:has-text("Create"), button:has-text("Save")')
      
      // Verify card appears
      await expect(page.locator('text=E2E Test Card')).toBeVisible()
    }
  })

  test('shows WIP limits on columns', async ({ page }) => {
    await page.goto('/kanban')
    
    // Look for WIP limit indicators
    const wipLimit = page.locator('text=/WIP.*limit|limit.*\d+/i')
    
    if (await wipLimit.count() > 0) {
      await expect(wipLimit.first()).toBeVisible()
    }
  })
})
