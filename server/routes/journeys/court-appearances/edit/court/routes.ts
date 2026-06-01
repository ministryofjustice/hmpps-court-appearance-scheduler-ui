import { BaseRouter } from '../../../../common/routes'
import { EditCourtAppearanceCourtController } from './controller'
import { validate } from '../../../../../middleware/validation/validationMiddleware'
import { schemaFactory } from './schema'
import { Services } from '../../../../../services'

export const EditCourtAppearanceCourtRoutes = ({ courtAppearanceSchedulerService, courtRegisterService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new EditCourtAppearanceCourtController(courtAppearanceSchedulerService, courtRegisterService)

  get('/', controller.GET)
  post('/', validate(schemaFactory(courtRegisterService)), controller.submitToApi, controller.POST)

  return router
}
