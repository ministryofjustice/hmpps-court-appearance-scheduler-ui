import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../../integration_tests/mockApis/prisonerSearchApi'

import { stubGetPrisonerImage } from '../../../../../../integration_tests/mockApis/prisonApi'
import { formatInputDate } from '../../../../../utils/dateTimeUtils'
import { EditCourtAppearanceDateTimePage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testCourtAppearance } from '../../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../../integration_tests/testUtils'
import {
  stubGetCourtAppearance,
  stubPutCourtAppearance,
} from '../../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'

test.describe('/court-appearances/edit/date-and-time unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/court-appearances/edit/date-and-time')
  })
})

test.describe('/court-appearances/edit/date-and-time', () => {
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
            domainEvents: ['person.court-appearance.rescheduled'],
            changes: [{ propertyName: '', previous: '', change: '' }],
          },
        ],
      }),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should edit court appearance date and time', async ({ page }) => {
    await login(page)

    const journeyId = uuidV4()
    await page.goto(`${journeyId}/court-appearances/start-edit/${courtAppearanceId}/date-and-time`)

    // verify page content
    const testPage = await new EditCourtAppearanceDateTimePage(page).verifyContent()

    await expect(testPage.dateField()).toBeVisible()
    await expect(testPage.dateField()).toHaveValue('1/1/2001')
    await expect(testPage.hourField()).toBeVisible()
    await expect(testPage.hourField()).toHaveValue('10')
    await expect(testPage.minuteField()).toBeVisible()
    await expect(testPage.minuteField()).toHaveValue('00')
    await expect(testPage.button('Save')).toBeVisible()

    // verify validation error
    await testPage.dateField().clear()
    await testPage.hourField().clear()
    await testPage.minuteField().clear()
    await testPage.clickButton('Save')
    await testPage.link('Enter or select a date').click()
    await expect(testPage.dateField()).toBeFocused()
    await testPage.link('Enter a time').click()
    await expect(testPage.hourField()).toBeFocused()

    await testPage.hourField().fill('24')
    await testPage.minuteField().fill('1.2')
    await testPage.clickButton('Save')

    await testPage.link('Hour must be between 00 and 23').click()
    await expect(testPage.hourField()).toBeFocused()
    await testPage.link('Minute must be between 00 and 59').click()
    await expect(testPage.minuteField()).toBeFocused()

    // verify next page routing
    const today = formatInputDate(new Date().toISOString())!
    await testPage.dateField().fill(today)
    await testPage.hourField().fill('23')
    await testPage.minuteField().fill('59')
    await testPage.clickButton('Save')

    expect(page.url()).toMatch(/\/court-appearances\/edit\/confirmation/)
  })
})
