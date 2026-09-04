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
import { stubGetCourts } from '../../../../../integration_tests/mockApis/courtRegisterApi'
import { stubGetReasons } from '../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { formatInputDate } from '../../../../utils/dateTimeUtils'

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
    await page.goto(`/${journeyId}/add-court-appearance/details`)
  }

  test('should try all cases', async ({ page }) => {
    const journeyId = uuidV4()
    await startJourney(page, journeyId)

    // verify page content
    const testPage = await new CourtAppearanceDetailsPage(page).verifyContent()

    await expect(testPage.dateField()).toBeVisible()
    await expect(testPage.dateField()).toHaveValue('')
    await expect(testPage.hourField()).toBeVisible()
    await expect(testPage.hourField()).toHaveValue('10')
    await expect(testPage.minuteField()).toBeVisible()
    await expect(testPage.minuteField()).toHaveValue('00')
    await expect(testPage.courtInput()).toBeVisible()
    await expect(testPage.courtInput()).toHaveValue('')
    await expect(testPage.reasonInput()).toBeVisible()
    await expect(testPage.reasonInput()).toHaveValue('')
    await expect(testPage.button('Continue')).toBeVisible()

    // verify validation error
    await testPage.hourField().clear()
    await testPage.minuteField().clear()
    await testPage.clickContinue()
    await testPage.link('Enter or select a date').click()
    await expect(testPage.dateField()).toBeFocused()
    await testPage.link('Enter a time').click()
    await expect(testPage.hourField()).toBeFocused()
    await testPage.link('Enter and select a court location').click()
    await expect(testPage.courtInput()).toBeFocused()
    await testPage.link('Enter and select a reason').click()
    await expect(testPage.reasonInput()).toBeFocused()

    await testPage.dateField().fill('1/1/1999')
    await testPage.hourField().fill('24')
    await testPage.minuteField().fill('1.2')
    await testPage.clickContinue()

    await testPage.link('Court appearance date must be today or in the future').click()
    await expect(testPage.dateField()).toBeFocused()
    await testPage.link('Hour must be between 00 and 23').click()
    await expect(testPage.hourField()).toBeFocused()
    await testPage.link('Minute must be between 00 and 59').click()
    await expect(testPage.minuteField()).toBeFocused()

    await testPage.hourField().fill('17')
    await testPage.minuteField().fill('00')
    await testPage.clickContinue()
    await testPage.link('Start time must be before 17:00').click()
    await expect(testPage.hourField()).toBeFocused()

    // verify next page routing
    const today = formatInputDate(new Date().toISOString())!
    await testPage.dateField().fill(today)
    await testPage.hourField().fill('16')
    await testPage.minuteField().fill('59')
    await testPage.courtInput().click()
    await page.getByText('Some Court').first().click()
    await testPage.reasonInput().click()
    await page.getByText('Some Reason').first().click()
    await testPage.clickContinue()

    expect(page.url()).toMatch(/\/add-court-appearance\/comments/)

    // verify input values are persisted
    await page.goBack()
    await page.reload()
    await expect(testPage.dateField()).toHaveValue(today)
    await expect(testPage.hourField()).toHaveValue('16')
    await expect(testPage.minuteField()).toHaveValue('59')
    await expect(testPage.courtInput()).toHaveValue('Some Court')
    await expect(testPage.reasonInput()).toHaveValue('Some Reason')
  })
})
