import { formatDate } from '../../../utils/dateTimeUtils'
import { components } from '../../../@types/courtAppearanceScheduler'
import { CodedDescription } from '../../../@types/journeys'

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
    content: 'Court appearance scheduled for <prisoner><source>',
  },
  'person.court-appearance.expired': {
    heading: 'Expired',
    content: 'Court appearance scheduled for <prisoner> has expired',
    skipUser: true,
  },
  'person.court-appearance.recorded': {
    heading: 'Recorded',
    content: 'Court appearance recorded for <prisoner><source>',
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
  'person.court-appearance.unscheduled': {
    heading: 'Unscheduled',
    content: 'Court appearance unscheduled for <prisoner>',
  },
  'person.court-appearance.responsible-prison-changed': {
    heading: 'Court appearance responsible prison changed',
  },
}

const CHANGE_PROPERTY_MAP: { [key: string]: string } = {
  start: 'Start date and time',
  courtCode: 'Court location',
  reason: 'Reason',
  comments: 'Comments',
  prisonCode: 'Responsible prison',
}

const parseChangedPropertyValue = (
  domain: string,
  property: string,
  value: unknown,
  courts: CodedDescription[],
  prisons: CodedDescription[],
) => {
  if (!value) return 'Not applicable'

  if (property === 'courtCode') {
    const court = courts.find(({ code }) => code === value)
    if (court) return `“${court.description}”`
    return `unknown court code “${value}”`
  }

  if (property === 'prisonCode') {
    const prison = prisons.find(({ code }) => code === value)
    if (prison) return `“${prison.description}”`
    return `unknown prison code “${value}”`
  }

  if (domain.endsWith('comments-changed') && property === 'comments') return `“${value}”`

  if (domain.endsWith('date-range-changed') && ['start', 'end'].includes(property)) return formatDate(String(value))

  if (domain.endsWith('rescheduled') && ['start', 'end'].includes(property))
    return formatDate(String(value), `d MMMM yyyy 'at' HH:mm`)

  return String(value)
}

export const parseAuditHistory = (
  history: components['schemas']['AuditedAction'][],
  courts: CodedDescription[] = [],
  prisons: CodedDescription[] = [],
) =>
  history
    .flatMap(action =>
      action.domainEvents.map(event => {
        const eventText = DOMAIN_EVENT_MAP[event]
        if (!eventText) return null

        const changes = !eventText.content
          ? action.changes
              .filter(({ propertyName }) => CHANGE_PROPERTY_MAP[propertyName])
              .map(change => {
                return `${CHANGE_PROPERTY_MAP[change.propertyName] ?? change.propertyName} ${change.propertyName === 'comments' ? 'were' : 'was'} changed from ${parseChangedPropertyValue(event, change.propertyName, change.previous, courts, prisons)} to ${parseChangedPropertyValue(event, change.propertyName, change.change, courts, prisons)}.`
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
