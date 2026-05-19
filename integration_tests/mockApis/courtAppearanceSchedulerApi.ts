import type { SuperAgentRequest } from 'superagent'
import { stubFor, successStub } from './wiremock'
import { components } from '../../server/@types/courtAppearanceScheduler'
import { testCourtAppearance } from '../data/testData'

export const stubCourtAppearanceSchedulerPing = (httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/court-appearance-scheduler-api/health/ping',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

export const stubGetReasons = () =>
  successStub({
    method: 'GET',
    urlPattern: '/court-appearance-scheduler-api/court-appearance-reasons',
    response: {
      items: [
        {
          code: 'REASON1',
          description: 'Some Reason',
        },
        {
          code: 'REASON2',
          description: 'Another Reason',
        },
      ],
    },
  })

export const stubPostCourtAppearance = (prisonNumber: string, resultId: string = 'court-appearance-id') =>
  successStub({
    method: 'POST',
    urlPattern: `/court-appearance-scheduler-api/court-appearances/${prisonNumber}`,
    response: { id: resultId },
  })

export const stubSearchCourtAppearances = (response: components['schemas']['CourtAppearanceSearchResponse']) =>
  successStub({
    method: 'POST',
    urlPattern: '/court-appearance-scheduler-api/search/prisons/LEI/court-appearances',
    response,
  })

export const stubSearchCourtAppearanceHistory = (
  prisonNumber: string,
  response: components['schemas']['CourtAppearanceSearchResponse'],
) =>
  successStub({
    method: 'POST',
    urlPattern: `/court-appearance-scheduler-api/search/people/${prisonNumber}/court-appearances`,
    response,
  })

export const stubGetCourtAppearance = (response: components['schemas']['Appearance'] = testCourtAppearance) =>
  successStub({
    method: 'GET',
    urlPattern: `/court-appearance-scheduler-api/court-appearances/${response.id}`,
    response,
  })

export const stubGetCourtAppearanceHistory = (
  courtAppearanceId: string,
  response: components['schemas']['AuditHistory'],
) =>
  successStub({
    method: 'GET',
    urlPattern: `/court-appearance-scheduler-api/court-appearances/${courtAppearanceId}/history`,
    response,
  })

export const stubPutCourtAppearance = (courtAppearanceId: string, response: components['schemas']['AuditHistory']) =>
  successStub({
    method: 'PUT',
    urlPattern: `/court-appearance-scheduler-api/court-appearances/${courtAppearanceId}`,
    response,
  })
