import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceConfirmationPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/confirmation/,
      title: 'Court appearance saved - Add a court appearance - DPS',
      heading: 'Court appearance saved for Prisoner-Name Prisoner-Surname',
    })
  }
}
