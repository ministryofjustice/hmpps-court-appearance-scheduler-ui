import { v4 as uuidV4 } from 'uuid'
import { expect, test, Page } from '@playwright/test'
import auth from '../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../integration_tests/mockApis/prisonApi'
import { CourtAppearanceCommentsPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testPrisonerDetails } from '../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../integration_tests/testUtils'
import { injectJourneyData } from '../../../../../integration_tests/steps/journey'

test.describe('/add-court-appearance/comments unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/add-court-appearance/comments')
  })
})

test.describe('/add-court-appearance/comments', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([auth.stubSignInPage(), stubComponents(), stubGetPrisonerImage(), stubGetPrisonerDetails()])
    await login(page)
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  const startJourney = async (page: Page, journeyId: string) => {
    await page.goto(`/${journeyId}/add-court-appearance/start/${testPrisonerDetails.prisonerNumber}`)
    await injectJourneyData(page, journeyId, {
      addCourtAppearance: {
        backUrl: 'back-url',
        historyQuery: 'history',
        startDate: '2001-01-01',
        startTime: '10:00',
        court: { code: 'COURT1', description: 'Some Court' },
        reason: { code: 'REASON1', description: 'Some Reason' },
      },
    })
    await page.goto(`/${journeyId}/add-court-appearance/comments`)
  }

  test('should try all cases', async ({ page }) => {
    const journeyId = uuidV4()
    await startJourney(page, journeyId)

    // verify page content
    const testPage = await new CourtAppearanceCommentsPage(page).verifyContent()

    await expect(testPage.commentsField()).toBeVisible()
    await expect(testPage.commentsField()).toHaveValue('')
    await expect(testPage.button('Continue')).toBeVisible()

    // verify validation error
    await testPage.commentsField().fill('n'.repeat(4001))
    await testPage.clickContinue()
    await testPage.link('The maximum character limit is 4000').click()
    await expect(testPage.commentsField()).toBeFocused()

    // verify next page routing
    await testPage.commentsField().fill('Lorem ipsum')
    await testPage.clickContinue()

    expect(page.url()).toMatch(/\/add-court-appearance\/check-answers/)

    // verify input values are persisted
    await page.goBack()
    await page.reload()
    await expect(testPage.commentsField()).toHaveValue('Lorem ipsum')
  })
})
