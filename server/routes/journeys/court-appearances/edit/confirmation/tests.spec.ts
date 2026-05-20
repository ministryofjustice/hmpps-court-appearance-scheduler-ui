import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../../integration_tests/mockApis/prisonApi'
import { EditCourtAppearanceConfirmationPage } from './test.page'

import { login } from '../../../../../../integration_tests/testUtils'
import { resetStubs } from '../../../../../../integration_tests/mockApis/wiremock'
import { stubGetCourtAppearance } from '../../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { testCourtAppearance } from '../../../../../../integration_tests/data/testData'
import { testNotAuthorisedPage } from '../../../../../../integration_tests/steps/testNotAuthorisedPage'
import { injectJourneyData } from '../../../../../../integration_tests/steps/journey'

test.describe('/court-appearances/edit/confirmation unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/court-appearances/edit/confirmation')
  })
})

test.describe('/court-appearances/edit/confirmation', () => {
  const courtAppearanceId = uuidV4()

  test.beforeEach(async () => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubGetCourtAppearance({
        ...testCourtAppearance,
        id: courtAppearanceId,
      }),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should confirm court appearance cancelled', async ({ page }) => {
    await login(page)

    const journeyId = uuidV4()
    await page.goto(`${journeyId}/court-appearances/start-edit/${courtAppearanceId}/cancel`)
    await injectJourneyData(page, journeyId, {
      updateCourtAppearance: {
        backUrl: `/court-appearances/${courtAppearanceId}`,
        courtAppearance: testCourtAppearance,
        historyQuery: 'historyQuery',
        result: {
          content: [
            {
              user: { username: 'USERNAME', name: 'User Name' },
              occurredAt: '2025-12-01T17:50:20.421301',
              domainEvents: ['person.court-appearance.cancelled'],
              changes: [{ propertyName: '', previous: '', change: '' }],
            },
          ],
        },
      },
    })
    await page.goto(`${journeyId}/court-appearances/edit/confirmation`)

    // verify page content
    const testPage = await new EditCourtAppearanceConfirmationPage(page).verifyContent()

    await expect(page.getByText('Court appearance cancelled for Prisoner-Name Prisoner-Surname')).toBeVisible()

    await testPage.verifyLink('Back to court appearances', '/')
    await testPage.verifyLink('Back to Manage court appearance', '/court-appearances')
  })
})
