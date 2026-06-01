import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class EditCourtAppearanceDateTimePage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/date-and-time/,
      title: 'Enter the court appearance date and time - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: 'Enter the court appearance date and time',
      backUrl: /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
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
