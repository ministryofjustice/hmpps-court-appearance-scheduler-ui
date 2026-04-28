import { BaseRouter } from '../../../common/routes'
import { CourtAppearanceDateTimeController } from './controller'
import { validate } from '../../../../middleware/validation/validationMiddleware'
import { schema } from './schema'

export const CourtAppearanceDateTimeRoutes = () => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceDateTimeController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
