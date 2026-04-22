import { BaseTestPage } from '../../integration_tests/pages/baseTestPage'

export class CourtAppearancesHomepage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /localhost:3007\/?$/,
      title: 'Court appearances - DPS',
      heading: 'Court appearances',
    })
  }
}
