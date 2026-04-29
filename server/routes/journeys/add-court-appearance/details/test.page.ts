import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceDetailsPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/details/,
      title: 'Add court appearance details - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Add court appearance details',
      backUrl: /date-and-time/,
    })
  }

  courtInput() {
    return this.dropdown('Which court is this appearance at?')
  }

  reasonInput() {
    return this.dropdown('Enter a reason for this court appearance')
  }
}
