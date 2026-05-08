import { Services } from '../../services'
import { BaseRouter } from '../common/routes'
import { CourtAppearanceHistoryController } from './controller'
import { Page } from '../../services/auditService'
import { validateOnGET } from '../../middleware/validation/validationMiddleware'
import { schema } from './schema'

export const CourtAppearanceHistoryRoutes = ({
  courtAppearanceSchedulerService,
  courtRegisterService,
  populatePrisonerMiddleware,
}: Services) => {
  const { router, get } = BaseRouter()

  const controller = new CourtAppearanceHistoryController(courtAppearanceSchedulerService, courtRegisterService)

  get(
    '/:prisonNumber',
    Page.VIEW_COURT_APPEARANCE_HISTORY,
    populatePrisonerMiddleware,
    validateOnGET(schema, '*'),
    controller.GET,
  )

  return router
}
