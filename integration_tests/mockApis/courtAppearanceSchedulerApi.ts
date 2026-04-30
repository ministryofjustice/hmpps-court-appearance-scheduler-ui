import type { SuperAgentRequest } from 'superagent'
import { stubFor, successStub } from './wiremock'

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
