import { v4 as uuidV4 } from 'uuid'
import { test, Page } from '@playwright/test'
import auth from '../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../integration_tests/mockApis/prisonApi'
import { CourtAppearanceConfirmationPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testPrisonerDetails } from '../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../integration_tests/testUtils'
import { injectJourneyData } from '../../../../../integration_tests/steps/journey'

test.describe('/add-court-appearance/confirmation unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/add-court-appearance/confirmation')
  })
})

test.describe('/add-court-appearance/confirmation', () => {
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
        comments: 'Lorem ipsum',
        result: { id: 'court-appearance-id' },
      },
    })
    await page.goto(`/${journeyId}/add-court-appearance/confirmation`)
  }

  test('should try all cases', async ({ page }) => {
    const journeyId = uuidV4()
    await startJourney(page, journeyId)

    // verify page content
    const testPage = await new CourtAppearanceConfirmationPage(page).verifyContent()

    await testPage.verifyLink('View and manage this court appearance', /court-appearances\/court-appearance-id/)
    await testPage.verifyLink('Add another court appearance', /search-prisoner\/add-court-appearance/)
    await testPage.verifyLink('View court appearances in your establishment', /court-appearances/)
    await testPage.verifyLink('Return to the DPS homepage', /localhost:3001$/)
  })
})
