import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../../integration_tests/mockApis/prisonApi'
import { EditCourtAppearanceReasonPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testCourtAppearance } from '../../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../../integration_tests/testUtils'
import {
  stubGetCourtAppearance,
  stubGetReasons,
  stubPutCourtAppearance,
} from '../../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'
import { getApiBody } from '../../../../../../integration_tests/mockApis/wiremock'

test.describe('/court-appearances/edit/reason unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/court-appearances/edit/reason')
  })
})

test.describe('/court-appearances/edit/reason', () => {
  const courtAppearanceId = uuidV4()

  test.beforeEach(async () => {
    await Promise.all([
      auth.stubSignInPage(),
      stubComponents(),
      stubGetPrisonerImage(),
      stubGetPrisonerDetails(),
      stubGetReasons(),
      stubGetCourtAppearance({
        ...testCourtAppearance,
        id: courtAppearanceId,
      }),
      stubPutCourtAppearance(courtAppearanceId, {
        content: [
          {
            user: { username: 'USERNAME', name: 'User Name' },
            occurredAt: '2025-12-01T17:50:20.421301',
            domainEvents: ['person.court-appearance.recategorised'],
            changes: [{ propertyName: '', previous: '', change: '' }],
          },
        ],
      }),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should edit court appearance reason', async ({ page }) => {
    await login(page)

    const journeyId = uuidV4()
    await page.goto(`${journeyId}/court-appearances/start-edit/${courtAppearanceId}/reason`)

    // verify page content
    const testPage = await new EditCourtAppearanceReasonPage(page).verifyContent()

    await expect(testPage.reasonInput()).toBeVisible()
    await expect(testPage.reasonInput()).toHaveValue('Some Reason')
    await expect(testPage.button('Save')).toBeVisible()

    // verify validation error
    await testPage.reasonInput().clear()
    await testPage.clickButton('Save') // click outside reasonInput to clear select option
    await testPage.clickButton('Save')
    await testPage.link('Enter and select a reason').click()
    await expect(testPage.reasonInput()).toBeFocused()

    // verify next page routing
    await testPage.reasonInput().click()
    await page.getByText('Another Reason').first().click()
    await testPage.clickButton('Save')

    expect(page.url()).toMatch(/\/court-appearances\/edit\/confirmation/)

    // verify API call
    expect(
      await getApiBody(`/court-appearance-scheduler-api/court-appearances/${courtAppearanceId}`, 'PUT'),
    ).toContainEqual({ actions: [{ type: 'RecategoriseAppearance', reasonCode: 'REASON2' }] })
  })
})
