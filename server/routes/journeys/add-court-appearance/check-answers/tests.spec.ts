import { v4 as uuidV4 } from 'uuid'
import { test, Page, expect } from '@playwright/test'
import auth from '../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../integration_tests/mockApis/prisonApi'
import { CourtAppearanceCheckAnswersPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testPrisonerDetails } from '../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../integration_tests/testUtils'
import { injectJourneyData } from '../../../../../integration_tests/steps/journey'
import { stubPostCourtAppearance } from '../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'

test.describe('/add-court-appearance/check-answers unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/add-court-appearance/check-answers')
  })
})

test.describe('/add-court-appearance/check-answers', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubPostCourtAppearance(testPrisonerDetails.prisonerNumber),
    ])
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
        comments: 'Lorem ipsum',
      },
    })
    await page.goto(`/${journeyId}/add-court-appearance/check-answers`)
  }

  test('should try all cases', async ({ page }) => {
    const journeyId = uuidV4()
    await startJourney(page, journeyId)

    // verify page content
    const testPage = await new CourtAppearanceCheckAnswersPage(page).verifyContent()
    await testPage.verifyAnswer('Date and time', '1 January 2001 at 10:00')
    await testPage.verifyAnswer('Court location', 'Some Court')
    await testPage.verifyAnswer('Reason', 'Some Reason')
    await testPage.verifyAnswer('Comments', 'Lorem ipsum')

    await testPage.verifyLink('Change date and time', /date-and-time/)
    await testPage.verifyLink('Change court location', /details#court/)
    await testPage.verifyLink('Change reason', /details#reason/)
    await testPage.verifyLink('Change comments', /comments/)

    await expect(testPage.button('Confirm and save')).toBeVisible()

    // verify next page routing
    await testPage.clickButton('Confirm and save')
    expect(page.url()).toMatch(/\/add-court-appearance\/confirmation/)
  })
})
