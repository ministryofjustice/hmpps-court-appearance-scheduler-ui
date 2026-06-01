import { BaseRouter } from '../../../../common/routes'
import { EditCourtAppearanceReasonController } from './controller'
import { validate } from '../../../../../middleware/validation/validationMiddleware'
import { schemaFactory } from './schema'
import { Services } from '../../../../../services'

export const EditCourtAppearanceReasonRoutes = ({ courtAppearanceSchedulerService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new EditCourtAppearanceReasonController(courtAppearanceSchedulerService)

  get('/', controller.GET)
  post('/', validate(schemaFactory(courtAppearanceSchedulerService)), controller.submitToApi, controller.POST)

  return router
}
