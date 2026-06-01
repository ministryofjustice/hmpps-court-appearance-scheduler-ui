import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class EditCourtAppearanceCourtPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/court/,
      title: 'Which court is this appearance at - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: 'Which court is this appearance at?',
      backUrl: /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    })
  }

  courtInput() {
    return this.dropdown('Which court is this appearance at?')
  }
}
