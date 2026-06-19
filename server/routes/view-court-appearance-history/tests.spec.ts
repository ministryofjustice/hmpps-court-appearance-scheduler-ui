import { expect, test } from '@playwright/test'
import auth from '../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerImage } from '../../../integration_tests/mockApis/prisonApi'
import { stubGetPrisonerDetails } from '../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetCourts } from '../../../integration_tests/mockApis/courtRegisterApi'
import {
  stubGetReasons,
  stubSearchCourtAppearanceHistory,
} from '../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { login } from '../../../integration_tests/testUtils'
import { resetStubs } from '../../../integration_tests/mockApis/wiremock'
import { CourtAppearanceHistoryPage } from './test.page'
import { verifyAuditEvents } from '../../../integration_tests/steps/verifyAuditEvents'
import { testPrisonerDetails } from '../../../integration_tests/data/testData'

test.describe('/view-court-appearance-history', () => {
  const prisonNumber = testPrisonerDetails.prisonerNumber

  test.beforeEach(async ({ page }) => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubGetCourts(),
      stubGetReasons(),
      stubSearchCourtAppearanceHistory(prisonNumber, {
        metadata: { totalElements: 11 },
        content: [
          {
            id: 'court-appearance-1',
            person: {
              personIdentifier: 'A9965EA',
              firstName: 'PRISONER-NAME',
              lastName: 'PRISONER-SURNAME',
              cellLocation: '2-1-005',
            },
            prison: {
              code: 'LEI',
              name: 'LEEDS',
            },
            status: { code: 'IN_PROGRESS', description: 'In progress' },
            start: '2001-01-01T10:00:00',
            end: '2001-01-01T17:00:00',
            court: { code: 'COURT1', name: 'Some Court' },
            reason: { code: 'REASON1', description: 'Some Reason', external: true },
            external: true,
          },
        ],
      }),
    ])
    await login(page)
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should show view court appearance history page', async ({ page }) => {
    await page.goto(`/view-court-appearance-history/${prisonNumber}`)

    const testPage = await new CourtAppearanceHistoryPage(page).verifyContent()

    await expect(testPage.startDateField()).toBeVisible()
    await expect(testPage.startDateField()).toHaveValue('')
    await expect(testPage.endDateField()).toBeVisible()
    await expect(testPage.endDateField()).toHaveValue('')
    await expect(testPage.courtInput()).toBeVisible()
    await expect(testPage.courtInput()).toHaveValue('')
    await expect(testPage.reasonInput()).toBeVisible()
    await expect(testPage.reasonInput()).toHaveValue('')

    await expect(page.getByText('Responsible prison: LEEDS')).toBeVisible()
    await expect(page.locator('strong', { hasText: 'Court location' }).locator('..')).toContainText('Some Court')
    await expect(page.locator('strong', { hasText: 'Date' }).locator('..')).toContainText('1 January 2001')
    await expect(page.locator('strong', { hasText: 'Time' }).locator('..')).toContainText('10:00')
    await expect(page.locator('strong', { hasText: 'Reason' }).locator('..')).toContainText('Some Reason')

    await testPage.endDateField().fill('test')
    await testPage.clickButton('Apply')
    await testPage.link('Enter or select a valid date to').click()
    await expect(testPage.endDateField()).toBeFocused()
    await expect(page.getByText('Enter a valid filter to search and view court appearances.')).toBeVisible()

    await verifyAuditEvents([
      {
        what: 'PAGE_VIEW',
        subjectType: 'NOT_APPLICABLE',
        details: expect.stringContaining(`"pageName":"VIEW_COURT_APPEARANCE_HISTORY","activeCaseLoadId":"LEI"`),
        service: 'hmpps-court-appearance-scheduler-ui',
        who: 'USER1',
        correlationId: expect.any(String),
        when: expect.any(String),
      },
    ])
  })
})
