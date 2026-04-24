export interface PrisonerDetails {
  prisonerNumber: string
  lastName: string
  firstName: string
  dateOfBirth: string
  prisonName?: string | undefined
  cellLocation?: string | undefined
  prisonId?: string
}

export type JourneyData = {
  instanceUnixEpoch: number
  prisonerDetails?: PrisonerDetails
  isCheckAnswers?: boolean
  journeyCompleted?: boolean
  b64History?: string | undefined
  stateGuard?: boolean
  addCourtAppearance?: AddCourtAppearanceJourney
}

type CodedDescription = {
  code: string
  description: string
}

export type AddCourtAppearanceJourney = {
  backUrl: string
  historyQuery: string
} & Partial<{
  startDate: string
  startTime: string
  court: CodedDescription
  reason: CodedDescription
  comments: string | null
}>
