import { BaseTestPage } from '../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceDetailsPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/add-court-appearance\/details/,
      title: 'Enter the court details for this appearance - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Enter the court details for this appearance',
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

  courtInput() {
    return this.dropdown('Which court is this appearance at?')
  }

  reasonInput() {
    return this.dropdown('Enter a reason for this court appearance')
  }
}
