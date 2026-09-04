import { BaseRouter } from '../../../common/routes'
import { CourtAppearanceClashesController } from './controller'

export const CourtAppearanceClashesRoutes = () => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceClashesController()

  get('/', controller.GET)
  post('/', controller.POST)

  return router
}
