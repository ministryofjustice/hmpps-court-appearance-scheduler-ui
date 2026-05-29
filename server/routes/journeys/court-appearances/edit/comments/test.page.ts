import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class EditCourtAppearanceCommentsPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/comments/,
      title: 'Enter any comments for this court appearance - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: 'Enter any comments for this court appearance (optional)',
      backUrl: /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    })
  }

  commentsField() {
    return this.textbox('Enter any comments for this court appearance (optional)')
  }
}
