import { BaseRouter } from '../../../common/routes'
import { CourtAppearanceDetailsController } from './controller'
import { Services } from '../../../../services'
import { validate } from '../../../../middleware/validation/validationMiddleware'
import { schemaFactory } from './schema'

export const CourtAppearanceDetailsRoutes = ({ courtAppearanceSchedulerService, courtRegisterService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceDetailsController(courtAppearanceSchedulerService, courtRegisterService)

  get('/', controller.GET)
  post('/', validate(schemaFactory(courtAppearanceSchedulerService, courtRegisterService)), controller.POST)

  return router
}
