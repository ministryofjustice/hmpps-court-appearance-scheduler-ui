import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  HOMEPAGE = 'HOMEPAGE',
  SEARCH_PRISONER = 'SEARCH_PRISONER',
  ADD_COURT_APPEARANCE = 'ADD_COURT_APPEARANCE',
  BROWSE_COURT_APPEARANCES = 'BROWSE_COURT_APPEARANCES',
  MANAGE_COURT_APPEARANCE = 'MANAGE_COURT_APPEARANCE',
  VIEW_COURT_APPEARANCE_HISTORY = 'VIEW_COURT_APPEARANCE_HISTORY',
  UPDATE_COURT_APPEARANCE = 'UPDATE_COURT_APPEARANCE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event, false)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event, false)
  }
}
