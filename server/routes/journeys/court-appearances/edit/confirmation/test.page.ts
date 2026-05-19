import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class EditCourtAppearanceConfirmationPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/confirmation/,
      title: 'Change court apperance confirmation - View and manage court appearances - DPS',
      heading: /Court appearance .+/,
    })
  }
}
