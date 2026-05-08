import { BaseTestPage } from '../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceHistoryPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/view-court-appearance-history\/(\w|-)+/,
      title: 'Court appearance history - View a prisoners court appearance history - DPS',
      caption: 'View a prisoners court appearance history',
      heading: /.+ court appearance history/,
    })
  }

  startDateField() {
    return this.textbox('Date from')
  }

  endDateField() {
    return this.textbox('Date to')
  }

  courtInput() {
    return this.dropdown('Court location')
  }

  reasonInput() {
    return this.dropdown('Reason')
  }
}
