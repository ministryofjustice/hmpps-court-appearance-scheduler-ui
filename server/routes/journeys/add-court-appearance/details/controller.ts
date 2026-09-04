import { Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../services/apis/courtRegisterService'
import { SchemaType } from './schema'
import { formatInputDate } from '../../../../utils/dateTimeUtils'
import CheckClashesService from '../../../../services/checkClashesService'

export class CourtAppearanceDetailsController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
    private readonly checkClashesService: CheckClashesService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, startDate, startTime, court, reason } = req.journeyData.addCourtAppearance!

    const [startTimeHour, startTimeMinute] =
      !res.locals.formResponses?.['startTimeHour'] && !res.locals.formResponses?.['startTimeMinute'] && startTime
        ? startTime.split(':')
        : []

    res.render('add-court-appearance/details/view', {
      backUrl,
      startDate: res.locals.formResponses?.['startDate'] ?? formatInputDate(startDate),
      startTimeHour: res.locals.formResponses?.['startTimeHour'] ?? startTimeHour,
      startTimeMinute: res.locals.formResponses?.['startTimeMinute'] ?? startTimeMinute,
      court: res.locals.formResponses?.['court'] ?? court?.code,
      reason: res.locals.formResponses?.['reason'] ?? reason?.code,
      courts: await this.courtRegisterService.getCourts({ res }),
      reasons: await this.courtAppearanceSchedulerService.getReasons({ res }),
    })
  }

  POST = async (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const journey = req.journeyData.addCourtAppearance!

    journey.startDate = req.body.startDate
    journey.startTime = `${req.body.startTimeHour}:${req.body.startTimeMinute}`
    journey.court = req.body.court
    journey.reason = req.body.reason

    journey.clashes = await this.checkClashesService.getClashes(
      { res },
      req.journeyData.prisonerDetails!.prisonerNumber,
      `${journey.startDate}T${journey.startTime}:00`,
      `${journey.startDate}T17:00:00`,
    )

    res.redirect(journey.clashes.length ? 'clashes' : 'comments')
  }
}
