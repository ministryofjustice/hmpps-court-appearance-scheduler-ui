import { Services } from '../../../services'
import { BaseRouter } from '../../common/routes'
import { Page } from '../../../services/auditService'
import { populatePrisonerDetails, toPrisonerDetails } from '../../../middleware/populatePrisonerDetails'
import preventNavigationToExpiredJourneys from '../../../middleware/journey/preventNavigationToExpiredJourneys'
import journeyStateGuard from '../../../middleware/journey/journeyStateGuard'
import redirectCheckAnswersMiddleware from '../../../middleware/journey/redirectCheckAnswersMiddleware'
import { CourtAppearanceDateTimeRoutes } from './date-and-time/routes'
import { CourtAppearanceDetailsRoutes } from './details/routes'
import { CourtAppearanceCommentsRoutes } from './comments/routes'
import { CourtAppearanceCheckAnswersRoutes } from './check-answers/routes'
import { CourtAppearanceConfirmationRoutes } from './confirmation/routes'

export const AddCourtAppearanceRoutes = (services: Services) => {
  const { router, get } = BaseRouter()

  router.use(redirectCheckAnswersMiddleware([/check-answers/, /confirmation/]))

  const START_ENTRY_PAGES: string[] = [Page.SEARCH_PRISONER]

  get('/start/:prisonNumber', populatePrisonerDetails(services), (req, res) => {
    if (req.middleware?.prisonerData) {
      req.journeyData.prisonerDetails = toPrisonerDetails(req.middleware.prisonerData)

      const lastLandmark = res.locals.breadcrumbs.last()
      req.journeyData.addCourtAppearance = {
        backUrl:
          lastLandmark && START_ENTRY_PAGES.includes(lastLandmark.alias || '')
            ? lastLandmark.href
            : `${res.locals.prisonerProfileUrl}/prisoner/${req.journeyData.prisonerDetails.prisonerNumber}`,
        historyQuery: String(req.query['history']),
        startTime: '10:00',
      }
      res.redirect('../date-and-time')
    } else {
      res.notFound()
    }
  })

  get(
    '*any',
    Page.ADD_COURT_APPEARANCE,
    (req, res, next) => {
      if (req.journeyData.prisonerDetails) {
        res.setAuditDetails.prisonNumber(req.journeyData.prisonerDetails.prisonerNumber)
      }
      next()
    },
    preventNavigationToExpiredJourneys(),
    journeyStateGuard({}, services.telemetryClient),
  )

  router.use('/date-and-time', CourtAppearanceDateTimeRoutes())
  router.use('/details', CourtAppearanceDetailsRoutes(services))
  router.use('/comments', CourtAppearanceCommentsRoutes())
  router.use('/check-answers', CourtAppearanceCheckAnswersRoutes(services))
  router.use('/confirmation', CourtAppearanceConfirmationRoutes())

  return router
}
