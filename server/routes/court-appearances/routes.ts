import { Services } from '../../services'
import { BaseRouter } from '../common/routes'
import { BrowseCourtAppearancesController } from './controller'
import { Page } from '../../services/auditService'
import { validateOnGET } from '../../middleware/validation/validationMiddleware'
import { schema } from './schema'

export const BrowseCourtAppearancesRoutes = ({ courtAppearanceSchedulerService, courtRegisterService }: Services) => {
  const { router, get } = BaseRouter()

  const controller = new BrowseCourtAppearancesController(courtAppearanceSchedulerService, courtRegisterService)

  get('/', Page.BROWSE_COURT_APPEARANCES, validateOnGET(schema, '*'), controller.GET)

  return router
}
