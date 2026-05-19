import { BaseTestPage } from '../../../../../../integration_tests/pages/baseTestPage'

export class CourtAppearanceCancelPage extends BaseTestPage {
  async verifyContent() {
    return this.verify({
      pageUrl: /\/court-appearances\/edit\/cancel/,
      title: 'Cancel court appearance - View and manage court appearances - DPS',
      caption: 'View and manage court appearances',
      heading: /Are you sure you want to cancel .+ court appearance?/,
      backUrl: /\/court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    })
  }
}
