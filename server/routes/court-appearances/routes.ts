import { Services } from '../../services'
import { BaseRouter } from '../common/routes'
import { BrowseCourtAppearancesController } from './controller'
import { Page } from '../../services/auditService'
import { validateOnGET } from '../../middleware/validation/validationMiddleware'
import { schema } from './schema'
import { ManageCourtAppearanceController } from './manage/controller'

export const BrowseCourtAppearancesRoutes = ({
  courtAppearanceSchedulerService,
  courtRegisterService,
  populateCourtAppearanceMiddleware,
}: Services) => {
  const { router, get } = BaseRouter()

  const controller = new BrowseCourtAppearancesController(courtAppearanceSchedulerService, courtRegisterService)

  get('/', Page.BROWSE_COURT_APPEARANCES, validateOnGET(schema, '*'), controller.GET)
  get(
    '/:id',
    Page.MANAGE_COURT_APPEARANCE,
    populateCourtAppearanceMiddleware({ withHistory: true }),
    new ManageCourtAppearanceController().GET,
  )

  return router
}
