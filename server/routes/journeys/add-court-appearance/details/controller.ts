import { Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../services/apis/courtRegisterService'
import { SchemaType } from './schema'
import { formatInputDate } from '../../../../utils/dateTimeUtils'

export class CourtAppearanceDetailsController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
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
    req.journeyData.addCourtAppearance!.startDate = req.body.startDate
    req.journeyData.addCourtAppearance!.startTime = `${req.body.startTimeHour}:${req.body.startTimeMinute}`
    req.journeyData.addCourtAppearance!.court = req.body.court
    req.journeyData.addCourtAppearance!.reason = req.body.reason
    res.redirect('comments')
  }
}
