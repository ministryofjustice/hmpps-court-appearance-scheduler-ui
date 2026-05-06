import { components } from '../../server/@types/courtAppearanceScheduler'

export const testPrisonerDetails = {
  prisonerNumber: 'A9965EA',
  bookingId: '1223167',
  bookNumber: '59862A',
  firstName: 'PRISONER-NAME',
  lastName: 'PRISONER-SURNAME',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  youthOffender: false,
  status: 'ACTIVE IN',
  lastMovementTypeCode: 'ADM',
  lastMovementReasonCode: '24',
  inOutStatus: 'IN',
  prisonId: 'LEI',
  lastPrisonId: 'LEI',
  prisonName: 'Leeds (HMP)',
  cellLocation: '2-1-005',
  aliases: [],
  alerts: [
    {
      alertType: 'L',
      alertCode: 'LCE',
      active: true,
      expired: false,
    },
  ],
  legalStatus: 'REMAND',
  imprisonmentStatus: 'RECEP_REM',
  imprisonmentStatusDescription: 'On remand (reception)',
  convictedStatus: 'Remand',
  recall: false,
  indeterminateSentence: false,
  receptionDate: '2024-11-26',
  locationDescription: 'Leeds (HMP)',
  restrictedPatient: false,
  currentIncentive: {
    level: {
      code: 'STD',
      description: 'Standard',
    },
    dateTime: '2024-11-26T14:12:29',
    nextReviewDate: '2025-02-26',
  },
  addresses: [],
  emailAddresses: [],
  phoneNumbers: [],
  identifiers: [],
  allConvictedOffences: [],
}

export const testCourtAppearance: components['schemas']['Appearance'] = {
  id: 'court-appearance-id',
  person: {
    personIdentifier: 'A9965EA',
    firstName: 'PRISONER-NAME',
    lastName: 'PRISONER-SURNAME',
    prisonCode: 'LEI',
    cellLocation: 'TAP',
  },
  prison: {
    code: 'LEI',
    name: 'Leeds (HMP)',
  },
  court: {
    code: 'COURT1',
    name: 'Some Court',
  },
  reason: {
    code: 'REASON1',
    description: 'Some Reason',
    external: true,
  },
  external: true,
  start: '2001-01-01T10:00:00',
  end: '2001-010-01T17:00:00',
  status: {
    code: 'SCHEDULED',
    description: 'Scheduled',
  },
}
