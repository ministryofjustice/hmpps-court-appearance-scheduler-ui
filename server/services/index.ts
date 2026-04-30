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

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    prisonerSearchService: new PrisonerSearchApiService(hmppsAuthClient, prisonPermissionsService),
    prisonApiService: new PrisonApiService(hmppsAuthClient),
    courtAppearanceSchedulerService: new CourtAppearanceSchedulerService(hmppsAuthClient),
    courtRegisterService: new CourtRegisterService(hmppsAuthClient, cacheStore),
    cacheStore,
    prisonPermissionsService,
    telemetryClient,
  }
}

export type Services = ReturnType<typeof services>
