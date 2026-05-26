import { BaseRouter } from '../../../../common/routes'
import { EditCourtAppearanceDateTimeController } from './controller'
import { validate } from '../../../../../middleware/validation/validationMiddleware'
import { schema } from './schema'
import { Services } from '../../../../../services'

export const EditCourtAppearanceDateTimeRoutes = ({ courtAppearanceSchedulerService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new EditCourtAppearanceDateTimeController(courtAppearanceSchedulerService)

  get('/', controller.GET)
  post('/', validate(schema), controller.submitToApi, controller.POST)

  return router
}
