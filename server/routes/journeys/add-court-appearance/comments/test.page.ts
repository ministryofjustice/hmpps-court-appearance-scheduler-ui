import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceCommentsPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/comments/,
      title: 'Enter any comments for this court appearance - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Enter any comments for this court appearance (optional)',
      backUrl: /details/,
    })
  }

  commentsField() {
    return this.textbox('Enter any comments for this court appearance (optional)')
  }
}
