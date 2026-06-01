import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class EditCourtAppearanceReasonPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/reason/,
      title: 'Enter a reason for this court appearance - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: 'Enter a reason for this court appearance',
      backUrl: /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    })
  }

  reasonInput() {
    return this.dropdown('Enter a reason for this court appearance')
  }
}
