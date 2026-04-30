import { CourtAppearanceCheckAnswersController } from './controller'
import { Services } from '../../../../services'
import { BaseRouter } from '../../../common/routes'

export const CourtAppearanceCheckAnswersRoutes = ({ courtAppearanceSchedulerService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceCheckAnswersController(courtAppearanceSchedulerService)

  get('/', controller.GET)
  post('/', controller.submitToApi, controller.POST)

  get('/back', controller.BACK)

  return router
}
