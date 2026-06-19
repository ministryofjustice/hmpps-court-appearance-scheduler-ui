import { PermissionsService } from '@ministryofjustice/hmpps-prison-permissions-lib'
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

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient, telemetryClient } = dataAccess()

  const redisClient = config.redis.enabled ? createRedisClient() : null

  const cacheStore = <T>(prefix: string): CacheInterface<T> =>
    redisClient ? new RedisCache<T>(redisClient, prefix) : new InMemoryCache<T>(prefix)

  const prisonPermissionsService = PermissionsService.create({
    prisonerSearchConfig: config.apis.prisonerSearchApi,
    authenticationClient: hmppsAuthClient,
    logger,
    telemetryClient,
  })

  const courtAppearanceSchedulerService = new CourtAppearanceSchedulerService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchApiService(hmppsAuthClient, prisonPermissionsService)

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    prisonApiService: new PrisonApiService(hmppsAuthClient),
    courtRegisterService: new CourtRegisterService(hmppsAuthClient, cacheStore),
    prisonRegisterService: new PrisonRegisterService(hmppsAuthClient, cacheStore),
    prisonerSearchService,
    courtAppearanceSchedulerService,
    cacheStore,
    telemetryClient,
    populateCourtAppearanceMiddleware: populateCourtAppearance(courtAppearanceSchedulerService, prisonerSearchService),
    populatePrisonerMiddleware: populatePrisonerDetails(prisonPermissionsService),
  }
}

export type Services = ReturnType<typeof services>
