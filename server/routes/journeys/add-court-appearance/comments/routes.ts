import { BaseRouter } from '../../../common/routes'
import { CourtAppearanceCommentsController } from './controller'
import { validate } from '../../../../middleware/validation/validationMiddleware'
import { schema } from './schema'

export const CourtAppearanceCommentsRoutes = () => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceCommentsController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
