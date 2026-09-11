import { test, expect } from '@playwright/test'
import { stubComponents } from '../../integration_tests/mockApis/componentsApi'
import { login, resetStubs } from '../../integration_tests/testUtils'
import auth from '../../integration_tests/mockApis/hmppsAuth'

test.describe('sanitise url', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([auth.stubSignInPage(), stubComponents()])
    await login(page)
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should remove unnecessary trailing slash', async ({ page }) => {
    await page.goto('/search-prisoner/add-court-appearance/?history=history')
    expect(page.url()).toMatch(/\/search-prisoner\/add-court-appearance\?history/)
    await expect(page.getByText('Something went wrong')).not.toBeVisible()
  })

  test('should throw error for overly long url', async ({ page }) => {
    await page.goto(`/search-prisoner/add-court-appearance/?history=${'n'.repeat(3000)}`)
    await expect(page.getByText('Something went wrong')).toBeVisible()
  })
})
