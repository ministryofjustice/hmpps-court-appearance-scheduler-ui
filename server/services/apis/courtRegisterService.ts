import { Response as SuperAgentResponse } from 'superagent'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import CustomRestClient, { ApiRequestContext } from '../../data/customRestClient'
import config from '../../config'
import logger from '../../../logger'
import { Court } from './model/court'
import { CodedDescription } from '../../@types/journeys'

export default class CourtRegisterService {
  private restClient: CustomRestClient

  constructor(authenticationClient: AuthenticationClient) {
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
  }

  async getCourts(context: ApiRequestContext): Promise<CodedDescription[]> {
    return (await this.restClient.withContext(context).get<Court[]>({ path: '/courts' })).map(
      ({ courtId, courtName }) => ({
        code: courtId,
        description: courtName,
      }),
    )
  }
}
