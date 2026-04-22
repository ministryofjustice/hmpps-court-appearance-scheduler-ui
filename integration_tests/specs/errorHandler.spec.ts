import { expect, test } from '@playwright/test'
import auth from '../mockApis/hmppsAuth'
import { stubComponents } from '../mockApis/componentsApi'
import { login } from '../testUtils'
import { stubSearchPrisonerFail } from '../mockApis/prisonerSearchApi'

test.describe('test error handlers', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([auth.stubSignInPage(), stubComponents()])
    await login(page)
  })

  test('should show page not found when 404', async ({ page }) => {
    await page.goto('/non-existing-page')
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  })

  test('should show user error message on API errors', async ({ page }) => {
    await stubSearchPrisonerFail('LEI', '.+')

    await page.goto('/search-prisoner/add-court-appearance?searchTerm=test')
    await expect(page.getByRole('link', { name: 'Stubbed API error returned' })).toBeVisible()
  })
})
