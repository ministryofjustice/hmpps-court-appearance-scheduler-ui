import { Response as SuperAgentResponse } from 'superagent'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import CustomRestClient, { ApiRequestContext } from '../../data/customRestClient'
import config from '../../config'
import logger from '../../../logger'
import { components } from '../../@types/courtAppearanceScheduler'
import { CodedDescription } from '../../@types/journeys'

export default class CourtAppearanceSchedulerService {
  private restClient: CustomRestClient

  constructor(protected readonly authenticationClient: AuthenticationClient) {
    this.restClient = new CustomRestClient(
      'Court Appearance Scheduler API',
      config.apis.courtAppearanceScheduler,
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

  async getReasons(context: ApiRequestContext): Promise<CodedDescription[]> {
    return (
      await this.restClient.withContext(context).get<components['schemas']['CourtAppearanceReasons']>({
        path: '/court-appearance-reasons',
      })
    ).items
  }

  createCourtAppearance(
    context: ApiRequestContext,
    prisonNumber: string,
    request: components['schemas']['ScheduleCourtAppearance'],
  ) {
    return this.restClient.withContext(context).post<components['schemas']['ReferenceId']>({
      path: `/court-appearances/${prisonNumber}`,
      data: request,
    })
  }

  searchCourtAppearances(context: ApiRequestContext, request: components['schemas']['CourtAppearanceSearchRequest']) {
    return this.restClient
      .withContext({ ...context, readOnly: true })
      .post<components['schemas']['CourtAppearanceSearchResponse']>({
        path: `/search/prisons/${context.res.locals.user.getActiveCaseloadId()}/court-appearances`,
        data: request,
      })
  }

  async getCourtAppearance(context: ApiRequestContext, courtAppearanceId: string) {
    try {
      return await this.restClient.withContext(context).get<components['schemas']['Appearance']>({
        path: `/court-appearances/${courtAppearanceId}`,
      })
    } catch (error) {
      return this.handleGetError(error)
    }
  }

  async getCourtAppearanceAuditHistory(context: ApiRequestContext, courtAppearanceId: string) {
    try {
      return await this.restClient.withContext(context).get<components['schemas']['AuditHistory']>({
        path: `/court-appearances/${courtAppearanceId}/history`,
      })
    } catch (error) {
      return this.handleGetError(error)
    }
  }

  searchCourtAppearanceHistory(
    context: ApiRequestContext,
    prisonNumber: string,
    request: components['schemas']['PersonAppearanceSearchRequest'],
  ) {
    return this.restClient
      .withContext({ ...context, readOnly: true })
      .post<components['schemas']['CourtAppearanceSearchResponse']>({
        path: `/search/people/${prisonNumber}/court-appearances`,
        data: request,
      })
  }

  updateCourtAppearance(
    context: ApiRequestContext,
    courtAppearanceId: string,
    request: components['schemas']['CourtAppearanceActions']['actions'][0],
    reason?: string,
  ) {
    const data: components['schemas']['CourtAppearanceActions'] = {
      actions: [request],
    }
    if (reason) data.reason = reason
    return this.restClient.withContext(context).put<components['schemas']['AuditHistory']>({
      path: `/court-appearances/${courtAppearanceId}`,
      data,
    })
  }

  private handleGetError = (error: unknown) => {
    const statusCode = (error as { data?: { status?: number } })?.data?.status
    if (statusCode && statusCode >= 400 && statusCode <= 499) return null
    throw error
  }
}
