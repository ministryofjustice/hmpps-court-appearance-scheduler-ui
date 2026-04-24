import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceDateTimePage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/date-and-time/,
      title: 'Enter the court appearance date and time - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Enter the court appearance date and time',
    })
  }

  dateField() {
    return this.textbox(/What date will (.+?)’s court appearance be\?/)
  }

  hourField() {
    return this.textbox('Hour')
  }

  minuteField() {
    return this.textbox('Minute')
  }
}
