import { PermissionsService } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { dataAccess } from '../data'
import AuditService from './auditService'
import PrisonerSearchApiService from './apis/prisonerSearchService'
import config from '../config'
import logger from '../../logger'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient, telemetryClient } = dataAccess()

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
  }
}

export type Services = ReturnType<typeof services>
