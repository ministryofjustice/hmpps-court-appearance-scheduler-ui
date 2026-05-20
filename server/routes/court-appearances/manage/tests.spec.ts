import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../integration_tests/mockApis/prisonApi'
import { ManageCourtAppearancePage } from './test.page'
import { NotAuthorisedPage } from '../../../../integration_tests/pages/NotAuthorisedPage'

import { login } from '../../../../integration_tests/testUtils'
import { resetStubs } from '../../../../integration_tests/mockApis/wiremock'
import {
  stubGetCourtAppearance,
  stubGetCourtAppearanceHistory,
} from '../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { testCourtAppearance } from '../../../../integration_tests/data/testData'

test.describe('/court-appearances/:id', () => {
  test.beforeEach(async () => {
    await Promise.all([auth.stubSignInPage(), stubComponents(), stubGetPrisonerImage(), stubGetPrisonerDetails()])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should show 403 error if court appearance is outside the user caseloads', async ({ page }) => {
    await login(page)

    const courtAppearanceId = uuidV4()
    await stubGetCourtAppearance({
      ...testCourtAppearance,
      id: courtAppearanceId,
      prison: { code: 'OUT', name: 'OUT' },
    })
    await stubGetCourtAppearanceHistory(courtAppearanceId, { content: [] })
    await page.goto(`/court-appearances/${courtAppearanceId}`)
    await new NotAuthorisedPage(page).verifyContent()
  })

  test('should show court appearance details and edit links', async ({ page }) => {
    await login(page)

    const courtAppearanceId = uuidV4()
    await stubGetCourtAppearance({
      ...testCourtAppearance,
      id: courtAppearanceId,
    })
    await stubGetCourtAppearanceHistory(courtAppearanceId, {
      content: [
        {
          domainEvents: ['person.court-appearance.scheduled'],
          occurredAt: '2001-01-01T09:05:00',
          user: { name: 'User Name', username: 'USERNAME' },
          changes: [],
        },
        {
          domainEvents: ['person.court-appearance.rescheduled'],
          occurredAt: '2001-01-01T09:15:00',
          user: { name: 'User Name', username: 'USERNAME' },
          changes: [{ propertyName: 'start', previous: '2001-01-01T09:30:00', change: '2001-01-01T10:00:00' }],
        },
      ],
    })
    await page.goto(`/court-appearances/${courtAppearanceId}`)

    // verify page content
    const testPage = await new ManageCourtAppearancePage(page).verifyContent()

    await testPage.verifyAnswer('Date and time', '1 January 2001 at 10:00')
    await testPage.verifyAnswer('Court location', 'Some Court')
    await testPage.verifyAnswer('Reason', 'Some Reason')
    await testPage.verifyAnswer('Comments', 'Not provided')

    await expect(testPage.link('Change date and time (Court appearance information)')).toBeVisible()
    await expect(testPage.link('Change court location (Court appearance information)')).toBeVisible()
    await expect(testPage.link('Change reason (Court appearance information)')).toBeVisible()
    await expect(testPage.link('Change comments (Court appearance information)')).toBeVisible()

    await expect(testPage.button('Cancel this appearance')).toBeVisible()
    await expect(testPage.link('Create a new court appearance for Prisoner-Name Prisoner-Surname')).toBeVisible()

    // verify history tab
    await testPage.clickTab('Appearance history')

    await testPage.verifyHistoryEntry(
      /^Scheduled$/,
      ['Court appearance scheduled for Prisoner-Name Prisoner-Surname'],
      [],
    )
    await testPage.verifyHistoryEntry(
      'Rescheduled',
      [],
      ['Start date and time was changed from 1 January 2001 at 09:30 to 1 January 2001 at 10:00'],
    )
  })

  test('should not show edit links for view only user', async ({ page }) => {
    await login(page, { roles: ['ROLE_COURT_APPEARANCE_SCHEDULER_RO'] })
    const courtAppearanceId = uuidV4()
    await stubGetCourtAppearance({
      ...testCourtAppearance,
      id: courtAppearanceId,
    })
    await stubGetCourtAppearanceHistory(courtAppearanceId, { content: [] })
    await page.goto(`/court-appearances/${courtAppearanceId}`)

    // verify page content
    const testPage = await new ManageCourtAppearancePage(page).verifyContent()

    await testPage.verifyAnswer('Date and time', '1 January 2001 at 10:00')
    await testPage.verifyAnswer('Court location', 'Some Court')
    await testPage.verifyAnswer('Reason', 'Some Reason')
    await testPage.verifyAnswer('Comments', 'Not provided')

    await expect(testPage.link('Change date and time (Court appearance information)')).toHaveCount(0)
    await expect(testPage.link('Change court location (Court appearance information)')).toHaveCount(0)
    await expect(testPage.link('Change reason (Court appearance information)')).toHaveCount(0)
    await expect(testPage.link('Change comments (Court appearance information)')).toHaveCount(0)

    await expect(testPage.button('Cancel this appearance')).toHaveCount(0)
    await expect(testPage.link('Create a new court appearance for Prisoner-Name Prisoner-Surname')).toHaveCount(0)
  })
})
