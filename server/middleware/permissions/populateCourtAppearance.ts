import { RequestHandler } from 'express'
import CourtAppearanceSchedulerService from '../../services/apis/courtAppearanceSchedulerService'
import PrisonerSearchApiService from '../../services/apis/prisonerSearchService'

export const populateCourtAppearance =
  (
    courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    prisonerSearchApiService: PrisonerSearchApiService,
  ) =>
  ({ withHistory }: { withHistory: boolean }): RequestHandler<{ id: string }> => {
    return async (req, res, next) => {
      if (!req.method.match(/GET/i)) {
        return next()
      }

      const [courtAppearance, appearanceHistory] = await Promise.all([
        courtAppearanceSchedulerService.getCourtAppearance({ res }, req.params.id),
        withHistory ? courtAppearanceSchedulerService.getCourtAppearanceAuditHistory({ res }, req.params.id) : null,
      ])
      if (!res.locals.user.caseLoads?.find(caseLoad => caseLoad.caseLoadId === courtAppearance.prison.code)) {
        return res.notFound
      }

      req.middleware ??= {}
      req.middleware.courtAppearance = courtAppearance
      if (appearanceHistory) req.middleware.appearanceHistory = appearanceHistory
      req.middleware.prisonerData = await prisonerSearchApiService.getPrisonerDetails(
        { res },
        courtAppearance.person.personIdentifier,
      )
      res.locals.prisonerDetails = req.middleware.prisonerData

      return next()
    }
  }
