import { Request, Response } from 'express'
import { HTTPError } from 'superagent'
import CourtAppearanceSchedulerService from '../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../services/apis/courtRegisterService'
import { ResQuerySchemaType } from './schema'
import { components } from '../../@types/courtAppearanceScheduler'
import { getApiUserErrorMessage } from '../../utils/utils'
import { setPaginationLocals } from '../../views/partials/simplePagination/utils'
import { formatInputDate } from '../../utils/dateTimeUtils'

export class CourtAppearanceHistoryController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
  ) {}

  private PAGE_SIZE = 10

  private DEFAULT_SORT = 'start,asc'

  GET = async (req: Request, res: Response) => {
    const resQuery = res.locals['query'] as ResQuerySchemaType

    let searchResponse: components['schemas']['CourtAppearanceSearchResponse'] | undefined
    let results: components['schemas']['CourtAppearanceResult'][] = []

    try {
      if (resQuery.validated) {
        const requestBody: components['schemas']['PersonAppearanceSearchRequest'] = {
          start: resQuery.validated.start,
          end: resQuery.validated.end,
          courtCodes: resQuery.validated.court ? [resQuery.validated.court] : [],
          reason: resQuery.validated.reason ? [resQuery.validated.reason] : [],
          status: [],
          sort: resQuery.validated.sort ?? this.DEFAULT_SORT,
          page: resQuery.validated.page || 1,
          size: this.PAGE_SIZE,
        }

        if (resQuery.validated.type?.length === 1) {
          requestBody.external = resQuery.validated.type[0] === 'IN_PERSON'
        }

        searchResponse = await this.courtAppearanceSchedulerService.searchCourtAppearanceHistory(
          { res },
          req.middleware!.prisonerData!.prisonerNumber,
          requestBody,
        )
        results = searchResponse?.content ?? []
      }

      setPaginationLocals(
        res,
        this.PAGE_SIZE,
        resQuery?.validated?.page ?? 1,
        searchResponse?.metadata?.totalElements ?? 0,
        results.length,
        `?page={page}&sort=${resQuery?.sort ?? this.DEFAULT_SORT}&${[
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

    res.render('view-court-appearance-history/view', {
      showBreadcrumbs: true,
      courts: await this.courtRegisterService.getCourts({ res }),
      reasons: await this.courtAppearanceSchedulerService.getReasons({ res }),
      hasValidationError: !resQuery.validated,
      results,
      start: resQuery.validated?.start ? formatInputDate(resQuery.validated.start) : resQuery.start,
      end: resQuery.validated?.end ? formatInputDate(resQuery.validated.end) : resQuery.end,
      court: resQuery.court,
      reason: resQuery.reason,
      type: resQuery.type,
      sort: resQuery?.sort ?? this.DEFAULT_SORT,
    })
  }
}
