import { test, expect } from '@playwright/test'
import { stubComponents } from '../../integration_tests/mockApis/componentsApi'
import { login, resetStubs } from '../../integration_tests/testUtils'
import { CourtAppearancesHomepage } from './test.page'
import auth from '../../integration_tests/mockApis/hmppsAuth'

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([auth.stubSignInPage(), stubComponents()])
    await login(page, { name: 'A TestUser' })
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should render homepage', async ({ page }) => {
    const testPage = await new CourtAppearancesHomepage(page).verifyContent()

    await expect(testPage.link('Add a court appearance')).toHaveAttribute(
      'href',
      /\/search-prisoner\/add-court-appearance/,
    )
    await expect(testPage.link('View and manage court appearances')).toBeVisible()
    await expect(testPage.link('View a prisoner’s court appearance history')).toBeVisible()
  })
})
