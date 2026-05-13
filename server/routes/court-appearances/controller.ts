import { Request, Response } from 'express'
import { HTTPError } from 'superagent'
import CourtAppearanceSchedulerService from '../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../services/apis/courtRegisterService'
import { ResQuerySchemaType } from './schema'
import { components } from '../../@types/courtAppearanceScheduler'
import { getApiUserErrorMessage } from '../../utils/utils'
import { setPaginationLocals } from '../../views/partials/simplePagination/utils'
import { formatInputDate } from '../../utils/dateTimeUtils'

export class BrowseCourtAppearancesController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
  ) {}

  private PAGE_SIZE = 10

  private DEFAULT_SORT = 'start,desc'

  GET = async (_req: Request, res: Response) => {
    const resQuery = res.locals['query'] as ResQuerySchemaType

    if (resQuery.searchTerm?.trim()) {
      res.setAuditDetails.searchTerm(resQuery.searchTerm.trim())
    }

    let searchResponse: components['schemas']['CourtAppearanceSearchResponse'] | undefined
    let results: components['schemas']['CourtAppearanceResult'][] = []

    try {
      if (resQuery.validated) {
        const requestBody: components['schemas']['CourtAppearanceSearchRequest'] = {
          start: resQuery.validated.start,
          end: resQuery.validated.end,
          courtCodes: resQuery.validated.court ? [resQuery.validated.court] : [],
          reason: resQuery.validated.reason ? [resQuery.validated.reason] : [],
          status: [],
          sort: resQuery.validated.sort ?? this.DEFAULT_SORT,
          page: resQuery.validated.page || 1,
          size: this.PAGE_SIZE,
        }

        if (resQuery.validated.searchTerm) requestBody.query = resQuery.validated.searchTerm
        if (resQuery.validated.type?.length === 1) {
          requestBody.external = resQuery.validated.type[0] === 'IN_PERSON'
        }

        searchResponse = await this.courtAppearanceSchedulerService.searchCourtAppearances({ res }, requestBody)
        results = searchResponse?.content ?? []
      }

      setPaginationLocals(
        res,
        this.PAGE_SIZE,
        resQuery?.validated?.page ?? 1,
        searchResponse?.metadata?.totalElements ?? 0,
        results.length,
        `?page={page}&sort=${resQuery?.sort ?? this.DEFAULT_SORT}&${[
          `searchTerm=${resQuery?.searchTerm ?? ''}`,
          `start=${resQuery?.start ?? ''}`,
          `end=${resQuery?.end ?? ''}`,
          `court=${resQuery?.court ?? ''}`,
          `reason=${resQuery?.reason ?? ''}`,
          // eslint-disable-next-line no-nested-ternary
          ...(Array.isArray(resQuery?.type)
            ? resQuery.type.map(itm => `type=${itm}`)
            : resQuery.type
              ? [`type=${resQuery.type}`]
              : []),
        ].join('&')}`,
      )
    } catch (error: unknown) {
      res.locals['validationErrors'] = { apiError: [getApiUserErrorMessage(error as HTTPError)] }
    }

    const courtAddresses = await this.courtRegisterService.getCourtsWithAddress({ res })

    res.render('court-appearances/view', {
      showBreadcrumbs: true,
      courts: await this.courtRegisterService.getCourts({ res }),
      reasons: await this.courtAppearanceSchedulerService.getReasons({ res }),
      hasValidationError: !resQuery.validated,
      results: results.map(itm => {
        const courtAddress = courtAddresses.find(address => address.code === itm.court.code)
        if (courtAddress) {
          return {
            ...itm,
            court: {
              code: courtAddress.code,
              name: courtAddress.description,
            },
          }
        }
        return itm
      }),
      searchTerm: resQuery.searchTerm,
      start: resQuery.validated?.start ? formatInputDate(resQuery.validated.start) : resQuery.start,
      end: resQuery.validated?.end ? formatInputDate(resQuery.validated.end) : resQuery.end,
      court: resQuery.court,
      reason: resQuery.reason,
      type: resQuery.type,
      sort: resQuery?.sort ?? this.DEFAULT_SORT,
    })
  }
}
