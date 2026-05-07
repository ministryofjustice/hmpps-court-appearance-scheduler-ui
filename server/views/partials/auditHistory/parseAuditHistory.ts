import { formatDate } from '../../../utils/dateTimeUtils'
import { components } from '../../../@types/courtAppearanceScheduler'

type DomainEventText = {
  heading: string
  content?: string
  reasonRequested?: boolean
  changes?: string[]
  skipUser?: boolean
}

const DOMAIN_EVENT_MAP: { [key: string]: DomainEventText } = {
  'person.court-appearance.migrated': {
    heading: 'Migrated',
    content: 'Court appearance migrated from NOMIS',
    skipUser: true,
  },
  'person.court-appearance.scheduled': {
    heading: 'Scheduled',
    content: 'Court appearance scheduled for <prisoner>',
  },
  'person.court-appearance.expired': {
    heading: 'Expired',
    content: 'Court appearance scheduled for <prisoner> has expired',
    skipUser: true,
  },
  'person.court-appearance.recorded': {
    heading: 'Recorded',
    content: 'Court appearance recorded for <prisoner>',
  },
  'person.court-appearance.started': {
    heading: 'Started',
    content: 'Court appearance in progress for <prisoner>',
  },
  'person.court-appearance.completed': {
    heading: 'Completed',
    content: 'Court appearance completed for <prisoner>',
  },
  'person.court-appearance.relocated': {
    heading: 'Relocated',
  },
  'person.court-appearance.recategorised': {
    heading: 'Reason changed',
  },
  'person.court-appearance.requested-in-person': {
    heading: 'Requested in person',
    content: 'Court appearance for <prisoner> is now in person',
  },
  'person.court-appearance.requested-by-video-link': {
    heading: 'Requested by video link',
    content: 'Court appearance for <prisoner> is now by video link',
  },
  'person.court-appearance.rescheduled': {
    heading: 'Rescheduled',
  },
  'person.court-appearance.comments-changed': {
    heading: 'Comments changed',
  },
}

const CHANGE_PROPERTY_MAP: { [key: string]: string } = {
  start: 'Start date and time',
  court: 'Court location',
  reason: 'Reason',
  comments: 'Comments',
}

const parseChangedPropertyValue = (domain: string, property: string, value: unknown) => {
  if (!value) return 'Not applicable'

  if (domain.endsWith('comments-changed') && property === 'comments') return `“${value}”`

  if (domain.endsWith('date-range-changed') && ['start', 'end'].includes(property)) return formatDate(String(value))

  if (domain.endsWith('rescheduled') && ['start', 'end'].includes(property))
    return formatDate(String(value), `d MMMM yyyy 'at' HH:mm`)

  return String(value)
}

export const parseAuditHistory = (history: components['schemas']['AuditedAction'][]) =>
  history
    .flatMap(action =>
      action.domainEvents.map(event => {
        const eventText = DOMAIN_EVENT_MAP[event]
        if (!eventText) return null

        const changes = !eventText.content
          ? action.changes
              .map(change => {
                return `${CHANGE_PROPERTY_MAP[change.propertyName] ?? change.propertyName} ${change.propertyName === 'comments' ? 'were' : 'was'} changed from ${parseChangedPropertyValue(event, change.propertyName, change.previous)} to ${parseChangedPropertyValue(event, change.propertyName, change.change)}.`
              })
              .filter(itm => Boolean(itm))
          : null
        return {
          ...eventText,
          reason: action.reason,
          user: eventText.skipUser ? null : action.user,
          occurredAt: action.occurredAt,
          ...(changes ? { changes } : {}),
        }
      }),
    )
    .filter(itm => Boolean(itm))
