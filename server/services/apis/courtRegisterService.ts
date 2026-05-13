import { Response as SuperAgentResponse } from 'superagent'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import CustomRestClient, { ApiRequestContext } from '../../data/customRestClient'
import config from '../../config'
import logger from '../../../logger'
import { Court } from './model/court'
import { CodedDescription } from '../../@types/journeys'
import CacheInterface from '../../data/cache/cacheInterface'

export default class CourtRegisterService {
  private restClient: CustomRestClient

  private cache: CacheInterface<CodedDescription[]>

  private readonly COURT_REGISTER_CACHE_TIMEOUT = Number(process.env['COURT_REGISTER_CACHE_TIMEOUT'] ?? 60)

  constructor(
    protected readonly authenticationClient: AuthenticationClient,
    cacheStore: (prefix: string) => CacheInterface<CodedDescription[]>,
  ) {
    this.restClient = new CustomRestClient(
      'Court Register API',
      config.apis.courtRegister,
      logger,
      authenticationClient,
      false,
      (retry?: boolean) => (err: Error, res: SuperAgentResponse) => {
        if (!retry) return false
        if (err) return true
        if (res?.statusCode) {
          return res.statusCode >= 500
        }
        return undefined
      },
    )
    this.cache = cacheStore('court-register')
  }

  async getCourts(context: ApiRequestContext): Promise<CodedDescription[]> {
    const cacheKey = 'courts'
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached

    const courts = (await this.restClient.withContext(context).get<Court[]>({ path: '/courts' })).map(
      ({ courtId, courtName }) => ({
        code: courtId,
        description: courtName,
      }),
    )

    await this.cache.set(cacheKey, courts, this.COURT_REGISTER_CACHE_TIMEOUT)

    return courts
  }

  async getCourtsWithAddress(context: ApiRequestContext): Promise<CodedDescription[]> {
    console.log(await this.restClient.withContext(context).get<Court[]>({ path: '/courts' }))
    const cacheKey = 'court-addresses'
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached

    const courts = (await this.restClient.withContext(context).get<Court[]>({ path: '/courts' })).map(
      ({ courtId, courtName, buildings }) => {
        const address = buildings?.find(({ active }) => active)

        return {
          code: courtId,
          description: [
            courtName,
            address?.addressLine1,
            address?.addressLine2,
            address?.addressLine3,
            address?.addressLine4,
            address?.addressLine5,
            address?.postcode,
          ]
            .filter(Boolean)
            .join(', '),
        }
      },
    )

    await this.cache.set(cacheKey, courts, this.COURT_REGISTER_CACHE_TIMEOUT)

    return courts
  }
}
