import { expect, test } from '@playwright/test'
import { v4 as uuidV4 } from 'uuid'
import { format } from 'date-fns'
import auth from '../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerImage } from '../../../../integration_tests/mockApis/prisonApi'
import { stubGetPrisonerDetails } from '../../../../integration_tests/mockApis/prisonerSearchApi'
import {
  stubGetReasons,
  stubPostCourtAppearance,
} from '../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { testPrisonerDetails } from '../../../../integration_tests/data/testData'
import { login } from '../../../../integration_tests/testUtils'
import { getApiBody, resetStubs } from '../../../../integration_tests/mockApis/wiremock'
import { CourtAppearanceCheckAnswersPage } from './check-answers/test.page'
import { stubGetCourts } from '../../../../integration_tests/mockApis/courtRegisterApi'
import { CourtAppearanceDateTimePage } from './date-and-time/test.page'
import { formatInputDate } from '../../../utils/dateTimeUtils'
import { CourtAppearanceDetailsPage } from './details/test.page'
import { CourtAppearanceCommentsPage } from './comments/test.page'
import { CourtAppearanceConfirmationPage } from './confirmation/test.page'

test.describe('/add-court-appearance e2e ', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubGetCourts(),
      stubGetReasons(),
      stubPostCourtAppearance(testPrisonerDetails.prisonerNumber),
    ])
    await login(page)
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should create new court appearance', async ({ page }) => {
    const journeyId = uuidV4()
    await page.goto(`/${journeyId}/add-court-appearance/start/${testPrisonerDetails.prisonerNumber}`)

    // fill in all pages
    const dateTimePage = await new CourtAppearanceDateTimePage(page).verifyContent()
    await dateTimePage.dateField().fill(formatInputDate(new Date().toISOString())!)
    await dateTimePage.clickContinue()

    const detailsPage = await new CourtAppearanceDetailsPage(page).verifyContent()
    await detailsPage.courtInput().click()
    await page.getByText('Some Court').first().click()
    await detailsPage.reasonInput().click()
    await page.getByText('Some Reason').first().click()
    await detailsPage.clickContinue()

    const commentsPage = await new CourtAppearanceCommentsPage(page).verifyContent()
    await commentsPage.clickContinue()

    const checkAnswersPage = await new CourtAppearanceCheckAnswersPage(page).verifyContent()
    await checkAnswersPage.verifyAnswer('Date and time', `${format(new Date(), 'd MMMM yyyy')} at 10:00`)
    await checkAnswersPage.verifyAnswer('Court location', 'Some Court')
    await checkAnswersPage.verifyAnswer('Reason', 'Some Reason')
    await checkAnswersPage.verifyAnswer('Comments', 'Not provided')

    // verify changing answers
    await checkAnswersPage.clickLink('Change date and time')
    await dateTimePage.hourField().fill('11')
    await dateTimePage.minuteField().fill('30')
    await dateTimePage.clickContinue()
    await checkAnswersPage.verifyAnswer('Date and time', `${format(new Date(), 'd MMMM yyyy')} at 11:30`)

    await checkAnswersPage.clickLink('Change court location')
    await detailsPage.courtInput().clear()
    await detailsPage.courtInput().click()
    await page.getByText('Another Court').first().click()
    await detailsPage.clickContinue()
    await checkAnswersPage.verifyAnswer('Court location', 'Another Court')

    await checkAnswersPage.clickLink('Change reason')
    await detailsPage.reasonInput().clear()
    await detailsPage.reasonInput().click()
    await page.getByText('Another Reason').first().click()
    await detailsPage.clickContinue()
    await checkAnswersPage.verifyAnswer('Reason', 'Another Reason')

    await checkAnswersPage.clickLink('Change comments')
    await commentsPage.commentsField().fill('Lorem ipsum')
    await commentsPage.clickContinue()
    await checkAnswersPage.verifyAnswer('Comments', 'Lorem ipsum')

    // proceed to confirmation
    await checkAnswersPage.clickButton('Confirm and save')

    await new CourtAppearanceConfirmationPage(page).verifyContent()

    expect(
      await getApiBody(`/court-appearance-scheduler-api/court-appearances/${testPrisonerDetails.prisonerNumber}`),
    ).toContainEqual({
      start: `${new Date().toISOString().substring(0, 10)}T11:30:00`,
      end: `${new Date().toISOString().substring(0, 10)}T17:00:00`,
      courtCode: 'COURT2',
      reasonCode: 'REASON2',
      comments: 'Lorem ipsum',
    })
  })
})
