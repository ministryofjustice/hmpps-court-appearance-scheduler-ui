import { RequestHandler, Response } from 'express'
import { UserPermissionLevel } from '../../interfaces/hmppsUser'

export enum AuthorisedRoles {
  COURT_APPEARANCE_SCHEDULER_RO = 'COURT_APPEARANCE_SCHEDULER_RO',
  COURT_APPEARANCE_SCHEDULER_RW = 'COURT_APPEARANCE_SCHEDULER_RW',
}

const hasRole = (res: Response, ...roles: AuthorisedRoles[]) =>
  roles.some(role => res.locals.user.userRoles.includes(role))

export const populateUserPermissions: RequestHandler = async (_req, res, next) => {
  res.locals.user.permission = UserPermissionLevel.FORBIDDEN

  if (hasRole(res, AuthorisedRoles.COURT_APPEARANCE_SCHEDULER_RW)) {
    res.locals.user.permission = UserPermissionLevel.MANAGE
  } else if (hasRole(res, AuthorisedRoles.COURT_APPEARANCE_SCHEDULER_RO)) {
    res.locals.user.permission = UserPermissionLevel.VIEW_ONLY
  }

  return next()
}
