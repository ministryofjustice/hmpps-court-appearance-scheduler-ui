import { v4 as uuidV4 } from 'uuid'
import { expect, test, Page } from '@playwright/test'
import auth from '../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../integration_tests/mockApis/prisonerSearchApi'

import { stubGetPrisonerImage } from '../../../../../integration_tests/mockApis/prisonApi'
import { CourtAppearanceDetailsPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testPrisonerDetails } from '../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../integration_tests/testUtils'
import { injectJourneyData } from '../../../../../integration_tests/steps/journey'
import { stubGetCourts } from '../../../../../integration_tests/mockApis/courtRegisterApi'
import { stubGetReasons } from '../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'

test.describe('/add-court-appearance/details unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/add-court-appearance/details')
  })
})

test.describe('/add-court-appearance/details', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubGetCourts(),
      stubGetReasons(),
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
      },
    })
    await page.goto(`/${journeyId}/add-court-appearance/details`)
  }

  test('should try all cases', async ({ page }) => {
    const journeyId = uuidV4()
    await startJourney(page, journeyId)

    // verify page content
    const testPage = await new CourtAppearanceDetailsPage(page).verifyContent()

    await expect(testPage.courtInput()).toBeVisible()
    await expect(testPage.courtInput()).toHaveValue('')
    await expect(testPage.reasonInput()).toBeVisible()
    await expect(testPage.reasonInput()).toHaveValue('')
    await expect(testPage.button('Continue')).toBeVisible()

    // verify validation error
    await testPage.clickContinue()
    await testPage.link('Enter and select a court location').click()
    await expect(testPage.courtInput()).toBeFocused()
    await testPage.link('Enter and select a reason').click()
    await expect(testPage.reasonInput()).toBeFocused()

    // verify next page routing
    await testPage.courtInput().click()
    await page.getByText('Some Court').first().click()
    await testPage.reasonInput().click()
    await page.getByText('Some Reason').first().click()
    await testPage.clickContinue()

    expect(page.url()).toMatch(/\/add-court-appearance\/comments/)

    // verify input values are persisted
    await page.goBack()
    await page.reload()
    await expect(testPage.courtInput()).toHaveValue('Some Court')
    await expect(testPage.reasonInput()).toHaveValue('Some Reason')
  })
})
