import { v4 as uuidV4 } from 'uuid'
import { expect, test } from '@playwright/test'
import auth from '../../../../../../integration_tests/mockApis/hmppsAuth'
import { stubComponents } from '../../../../../../integration_tests/mockApis/componentsApi'
import { stubGetPrisonerDetails } from '../../../../../../integration_tests/mockApis/prisonerSearchApi'
import { stubGetPrisonerImage } from '../../../../../../integration_tests/mockApis/prisonApi'
import { EditCourtAppearanceCommentsPage } from './test.page'
import { testNotAuthorisedPage } from '../../../../../../integration_tests/steps/testNotAuthorisedPage'
import { testCourtAppearance } from '../../../../../../integration_tests/data/testData'
import { login, resetStubs } from '../../../../../../integration_tests/testUtils'
import {
  stubGetCourtAppearance,
  stubPutCourtAppearance,
} from '../../../../../../integration_tests/mockApis/courtAppearanceSchedulerApi'

test.describe('/court-appearances/edit/comments unauthorised', () => {
  test('should show unauthorised error', async ({ page }) => {
    await testNotAuthorisedPage(page, '/court-appearances/edit/comments')
  })
})

test.describe('/court-appearances/edit/comments', () => {
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
        comments: 'lorem ipsum',
      }),
      stubPutCourtAppearance(courtAppearanceId, {
        content: [
          {
            user: { username: 'USERNAME', name: 'User Name' },
            occurredAt: '2025-12-01T17:50:20.421301',
            domainEvents: ['person.court-appearance.comments-changed'],
            changes: [{ propertyName: '', previous: '', change: '' }],
          },
        ],
      }),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should edit court appearance comments', async ({ page }) => {
    await login(page)

    const journeyId = uuidV4()
    await page.goto(`${journeyId}/court-appearances/start-edit/${courtAppearanceId}/comments`)

    // verify page content
    const testPage = await new EditCourtAppearanceCommentsPage(page).verifyContent()

    await expect(testPage.commentsField()).toBeVisible()
    await expect(testPage.commentsField()).toHaveValue('lorem ipsum')
    await expect(testPage.button('Save')).toBeVisible()

    // verify validation error
    await testPage.commentsField().fill('n'.repeat(4001))
    await testPage.clickButton('Save')
    await testPage.link('The maximum character limit is 4000').click()
    await expect(testPage.commentsField()).toBeFocused()

    // verify next page routing
    await testPage.commentsField().clear()
    await testPage.commentsField().fill('dolor sit')
    await testPage.clickButton('Save')

    expect(page.url()).toMatch(/\/court-appearances\/edit\/confirmation/)
  })
})
