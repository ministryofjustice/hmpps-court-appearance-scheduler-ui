import { BaseRouter } from '../../../../common/routes'
import { EditCourtAppearanceConfirmationController } from './controller'

export const EditCourtAppearanceConfirmationRoutes = () => {
  const { router, get } = BaseRouter()
  const controller = new EditCourtAppearanceConfirmationController()

  get('/', controller.GET)

  return router
}
