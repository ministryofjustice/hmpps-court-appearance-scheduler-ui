import { Router } from 'express'
import { Services } from '../../services'
import setUpJourneyData from '../../middleware/journey/setUpJourneyData'
import { mergeObjects } from '../../utils/utils'
import { requirePermissions } from '../../middleware/permissions/requirePermissions'
import { UserPermissionLevel } from '../../interfaces/hmppsUser'
import { AddCourtAppearanceRoutes } from './add-court-appearance/routes'
import { UpdateCourtAppearanceRoutes } from './court-appearances/routes'

export const JourneyRoutes = (services: Services) => {
  const router = Router({ mergeParams: true })

  router.use(setUpJourneyData(services.cacheStore('journey')))

  router.get('*any', (req, res, next) => {
    if (req.journeyData.prisonerDetails) {
      res.locals.prisonerDetails = req.journeyData.prisonerDetails
    }
    next()
  })

  router.use(
    '/add-court-appearance',
    requirePermissions(UserPermissionLevel.MANAGE),
    AddCourtAppearanceRoutes(services),
  )

  router.use(
    '/court-appearances',
    requirePermissions(UserPermissionLevel.MANAGE),
    UpdateCourtAppearanceRoutes(services),
  )

  if (process.env.NODE_ENV === 'e2e-test') {
    router.get('/inject-journey-data', (req, res) => {
      const { data } = req.query
      const json = JSON.parse(atob(data as string))
      mergeObjects(req.journeyData, json)
      res.sendStatus(200)
    })
  }

  return router
}
