import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Response {
      notFound(): void
      notAuthorised(): void
      getPageViewEvent(isAttempt: boolean): AuditEvent
      setAuditDetails: {
        prisonNumber(prisonNumber: string): void
        searchTerm(searchTerm: string): void
        suppress(suppress: boolean): void
      }
      sendApiEvent?: (apiUrl: string, isAttempt: boolean) => void
    }

    interface Locals {
      user: HmppsUser
      digitalPrisonServicesUrl: string
      prisonerProfileUrl: string
    }
  }
}
