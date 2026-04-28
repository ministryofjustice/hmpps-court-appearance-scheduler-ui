import type { SuperAgentRequest } from 'superagent'
import { stubFor, successStub } from './wiremock'

export const stubCourtRegisterPing = (httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/court-register-api/health/ping',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

export const stubGetCourts = () =>
  successStub({
    method: 'GET',
    urlPattern: '/court-register-api/courts',
    response: [
      {
        courtId: 'COURT1',
        courtName: 'Some Court',
      },
      {
        courtId: 'COURT2',
        courtName: 'Another Court',
      },
    ],
  })
