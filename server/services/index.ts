import { PermissionsService } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { dataAccess } from '../data'
import AuditService from './auditService'
import PrisonerSearchApiService from './apis/prisonerSearchService'
import config from '../config'
import logger from '../../logger'
import CacheInterface from '../data/cache/cacheInterface'
import RedisCache from '../data/cache/redisCache'
import InMemoryCache from '../data/cache/inMemoryCache'
import { createRedisClient } from '../data/redisClient'
import PrisonApiService from './apis/prisonApiService'
import CourtAppearanceSchedulerService from './apis/courtAppearanceSchedulerService'
import CourtRegisterService from './apis/courtRegisterService'
import { populateCourtAppearance } from '../middleware/permissions/populateCourtAppearance'
import { populatePrisonerDetails } from '../middleware/populatePrisonerDetails'
import PrisonRegisterService from './apis/prisonRegisterService'
import ExternalMovementsService from './apis/externalMovementsService'
import TransferSchedulerService from './apis/transferSchedulerService'
import CheckClashesService from './checkClashesService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const redisClient = config.redis.enabled ? createRedisClient() : null

  const cacheStore = <T>(prefix: string): CacheInterface<T> =>
    redisClient ? new RedisCache<T>(redisClient, prefix) : new InMemoryCache<T>(prefix)

  const prisonPermissionsService = PermissionsService.create({
    prisonerSearchConfig: config.apis.prisonerSearchApi,
    authenticationClient: hmppsAuthClient,
    logger,
    telemetryClient: telemetry,
  })

  const courtAppearanceSchedulerService = new CourtAppearanceSchedulerService(hmppsAuthClient)
  const externalMovementsService = new ExternalMovementsService(hmppsAuthClient)
  const transferSchedulerService = new TransferSchedulerService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchApiService(hmppsAuthClient, prisonPermissionsService)

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    prisonApiService: new PrisonApiService(hmppsAuthClient),
    courtRegisterService: new CourtRegisterService(hmppsAuthClient, cacheStore),
    prisonRegisterService: new PrisonRegisterService(hmppsAuthClient, cacheStore),
    checkClashesService: new CheckClashesService(
      courtAppearanceSchedulerService,
      externalMovementsService,
      transferSchedulerService,
    ),
    prisonerSearchService,
    courtAppearanceSchedulerService,
    cacheStore,
    populateCourtAppearanceMiddleware: populateCourtAppearance(courtAppearanceSchedulerService, prisonerSearchService),
    populatePrisonerMiddleware: populatePrisonerDetails(prisonPermissionsService),
  }
}

export type Services = ReturnType<typeof services>
