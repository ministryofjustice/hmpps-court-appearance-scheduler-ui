import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceClashesPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/clashes/,
      title: 'This prisoner has a conflict - Add a court appearance - DPS',
      heading: 'This prisoner has a conflict',
    })
  }
}
