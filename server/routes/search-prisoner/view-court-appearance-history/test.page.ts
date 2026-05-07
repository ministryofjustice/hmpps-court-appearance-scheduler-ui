import { BaseTestPage } from '../../../../integration_tests/pages/baseTestPage'

export class AddCourtAppearanceSearchPrisonerPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/search-prisoner\/view-court-appearance-history/,
      title: 'Search for a prisoner - View a prisoners court appearance history - DPS',
      caption: 'View a prisoners court appearance history',
      heading: 'Search for a prisoner',
    })
  }

  searchField() {
    return this.textbox('Search for a prisoner')
  }
}
