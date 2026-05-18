import { Request, Response } from 'express'
import { Services } from '../../../services'
import { BaseRouter } from '../../common/routes'
import { createBackUrlFor } from '../../../middleware/history/historyMiddleware'
import { toPrisonerDetails } from '../../../middleware/populatePrisonerDetails'
import { EditCourtAppearanceRoutes } from './edit/routes'

export const UpdateCourtAppearanceRoutes = (services: Services) => {
  const { router, get } = BaseRouter()
  const { populateCourtAppearanceMiddleware } = services

  get(
    '/start-edit/:id/:property',
    populateCourtAppearanceMiddleware({ withHistory: false }),
    async (req: Request<{ id: string; property: string }>, res: Response) => {
      req.journeyData.updateCourtAppearance = {
        courtAppearance: req.middleware!.courtAppearance!,
        backUrl: createBackUrlFor(
          res,
          /court-appearances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
          `/court-appearances/${req.params.id}`,
        ),
        historyQuery: encodeURIComponent(String(req.query['history'])),
      }
      req.journeyData.prisonerDetails = toPrisonerDetails(req.middleware!.prisonerData!)
      res.redirect(`../../edit/${req.params.property}`)
    },
  )

  router.use('/edit', EditCourtAppearanceRoutes(services))

  return router
}
