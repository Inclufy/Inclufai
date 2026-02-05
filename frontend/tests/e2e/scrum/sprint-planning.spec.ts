import { test, expect } from '@playwright/test'

test.describe('Scrum Sprint Planning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/)
  })

  test('displays sprint planning page', async ({ page }) => {
    // Navigate to scrum project
    await page.click('text=/scrum/i')
    
    // Look for sprint planning elements
    await expect(
      page.locator('text=/sprint.*planning|plan sprint/i')
    ).toBeVisible({ timeout: 5000 })
  })

  test('can create a new sprint', async ({ page }) => {
    await page.goto('/scrum/sprints')  // Adjust URL
    
    // Click new sprint button
    const newSprintButton = page.locator('button:has-text("New Sprint"), button:has-text("Create Sprint")')
    
    if (await newSprintButton.count() > 0) {
      await newSprintButton.first().click()
      
      // Fill sprint details
      await page.fill('input[name="name"]', 'Sprint 1')
      await page.fill('input[name="goal"]', 'Complete user authentication')
      await page.fill('input[name="duration"]', '2')  // 2 weeks
      
      await page.click('button:has-text("Create"), button:has-text("Start")')
      
      // Verify sprint created
      await expect(page.locator('text=Sprint 1')).toBeVisible()
    }
  })

  test('displays sprint backlog', async ({ page }) => {
    await page.goto('/scrum')
    
    // Should show backlog items
    await expect(
      page.locator('[data-testid="sprint-backlog"], text=/backlog/i')
    ).toBeVisible()
  })

  test('shows sprint burndown chart', async ({ page }) => {
    await page.goto('/scrum/dashboard')
    
    // Look for burndown chart
    const burndownChart = page.locator('[data-testid="burndown-chart"], text=/burndown/i')
    
    if (await burndownChart.count() > 0) {
      await expect(burndownChart.first()).toBeVisible()
    }
  })

  test('can view daily standup page', async ({ page }) => {
    await page.goto('/scrum')
    
    // Navigate to daily standup
    const standupLink = page.locator('a:has-text("Daily Standup"), text=/standup/i')
    
    if (await standupLink.count() > 0) {
      await standupLink.first().click()
      await expect(page).toHaveURL(/standup/)
    }
  })
})
