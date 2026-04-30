import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceCheckAnswersPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/check-answers/,
      title: 'Check this information before saving this court appearance - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Check this information before saving this court appearance',
    })
  }
}
