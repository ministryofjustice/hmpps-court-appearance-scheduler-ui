import { BaseTestPage } from '../../../integration_tests/pages/baseTestPage'

export class BrowseCourtAppearancesPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances/,
      title: 'Search for a prisoner - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: /Search for a prisoner/,
    })
  }

  searchField() {
    return this.textbox('Search for a prisoner')
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
