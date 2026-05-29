import { Services } from '../../../../services'
import { BaseRouter } from '../../../common/routes'
import { Page } from '../../../../services/auditService'
import preventNavigationToExpiredJourneys from '../../../../middleware/journey/preventNavigationToExpiredJourneys'
import journeyStateGuard from '../../../../middleware/journey/journeyStateGuard'
import { CourtAppearanceCancelRoutes } from './cancel/routes'
import { EditCourtAppearanceConfirmationRoutes } from './confirmation/routes'
import { EditCourtAppearanceDateTimeRoutes } from './date-and-time/routes'
import { EditCourtAppearanceCourtRoutes } from './court/routes'
import { EditCourtAppearanceReasonRoutes } from './reason/routes'
import { EditCourtAppearanceCommentsRoutes } from './comments/routes'

export const EditCourtAppearanceRoutes = (services: Services) => {
  const { router, get } = BaseRouter()

  get(
    '*any',
    Page.UPDATE_COURT_APPEARANCE,
    (req, res, next) => {
      if (req.journeyData.prisonerDetails) {
        res.setAuditDetails.prisonNumber(req.journeyData.prisonerDetails.prisonerNumber)
      }
      next()
    },
    preventNavigationToExpiredJourneys(),
    journeyStateGuard({ '*': () => undefined }, services.telemetryClient),
  )

  router.use('/date-and-time', EditCourtAppearanceDateTimeRoutes(services))
  router.use('/court', EditCourtAppearanceCourtRoutes(services))
  router.use('/reason', EditCourtAppearanceReasonRoutes(services))
  router.use('/comments', EditCourtAppearanceCommentsRoutes(services))
  router.use('/cancel', CourtAppearanceCancelRoutes(services))
  router.use('/confirmation', EditCourtAppearanceConfirmationRoutes())

  return router
}
