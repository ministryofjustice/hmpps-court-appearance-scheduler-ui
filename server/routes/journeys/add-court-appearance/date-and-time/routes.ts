import { BaseRouter } from '../../../common/routes'
import { CourtAppearanceDateTimeController } from './controller'
import { validate } from '../../../../middleware/validation/validationMiddleware'
import { schema } from './schema'
import { populateSwitchOffBanner } from '../../../../middleware/populateSwitchOffBanner'

export const CourtAppearanceDateTimeRoutes = () => {
  const { router, get, post } = BaseRouter()
  const controller = new CourtAppearanceDateTimeController()

  get('/', populateSwitchOffBanner, controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
