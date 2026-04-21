import { BaseTestPage } from '../../../../integration_tests/pages/baseTestPage'

export class AddCourtAppearanceSearchPrisonerPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/search-prisoner\/add-court-appearance/,
      title: 'Search for a prisoner - Add a court appearance - DPS',
      caption: 'Add a court appearance',
      heading: 'Search for a prisoner',
    })
  }

  searchField() {
    return this.textbox('Search for a prisoner')
  }
}
