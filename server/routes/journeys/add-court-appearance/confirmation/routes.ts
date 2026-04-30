import { CourtAppearanceConfirmationController } from './controller'
import { BaseRouter } from '../../../common/routes'

export const CourtAppearanceConfirmationRoutes = () => {
  const { router, get } = BaseRouter()
  const controller = new CourtAppearanceConfirmationController()

  get('/', controller.GET)

  return router
}
