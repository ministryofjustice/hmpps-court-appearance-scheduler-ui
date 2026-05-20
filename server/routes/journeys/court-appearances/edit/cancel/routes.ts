import { Services } from '../../../../../services'
import { BaseRouter } from '../../../../common/routes'
import { CourtAppearanceCancelController } from './controller'

export const CourtAppearanceCancelRoutes = ({ courtAppearanceSchedulerService }: Services) => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceCancelController(courtAppearanceSchedulerService)

  get('/', controller.GET)
  post('/', controller.submitToApi, controller.POST)

  return router
}
