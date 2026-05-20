import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../../integration_tests/mockApis/prisonApi'
import { CourtAppearanceCancelPage } from './test.page'

import { login } from '../../../../../../integration_tests/testUtils'
import { resetStubs } from '../../../../../../integration_tests/mockApis/wiremock'
import {
  stubGetCourtAppearance,
  stubPutCourtAppearance,
} from '../../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { testCourtAppearance } from '../../../../../../integration_tests/data/testData'
import { testNotAuthorisedPage } from '../../../../../../integration_tests/steps/testNotAuthorisedPage'

test.describe('/court-appearances/edit/cancel unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/court-appearances/edit/cancel')
  })
})

test.describe('/court-appearances/edit/cancel', () => {
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
      stubPutCourtAppearance(courtAppearanceId, {
        content: [
          {
            user: { username: 'USERNAME', name: 'User Name' },
            occurredAt: '2025-12-01T17:50:20.421301',
            domainEvents: ['person.court-appearance.cancelled'],
            changes: [{ propertyName: '', previous: '', change: '' }],
          },
        ],
      }),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should cancel court appearance', async ({ page }) => {
    await login(page)

    const journeyId = uuidV4()
    await page.goto(`${journeyId}/court-appearances/start-edit/${courtAppearanceId}/cancel`)

    // verify page content
    const testPage = await new CourtAppearanceCancelPage(page).verifyContent()

    await expect(testPage.button('Cancel this appearance', true)).toBeVisible()
    await expect(testPage.button('Do not cancel this appearance')).toBeVisible()
    await expect(testPage.button('Do not cancel this appearance')).toHaveAttribute(
      'href',
      /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    )

    // verify next page routing
    await testPage.clickButton('Cancel this appearance', 0)
    expect(page.url()).toMatch(/\/court-appearances\/edit\/confirmation/)
  })
})
