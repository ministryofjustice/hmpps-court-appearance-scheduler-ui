import { BaseRouter } from '../../../../common/routes'
import { EditCourtAppearanceCommentsController } from './controller'
import { validate } from '../../../../../middleware/validation/validationMiddleware'
import { Services } from '../../../../../services'
import { schema } from '../../../add-court-appearance/comments/schema'

export const EditCourtAppearanceCommentsRoutes = ({ courtAppearanceSchedulerService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new EditCourtAppearanceCommentsController(courtAppearanceSchedulerService)

  get('/', controller.GET)
  post('/', validate(schema), controller.submitToApi, controller.POST)

  return router
}
