import { NextFunction, Request, Response } from 'express'
import { format } from 'date-fns'
import { SchemaType } from './schema'
import { formatInputDate } from '../../../../../utils/dateTimeUtils'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'

export class EditCourtAppearanceDateTimeController {
  constructor(private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, courtAppearance } = req.journeyData.updateCourtAppearance!

    const [startTimeHour, startTimeMinute] =
      !res.locals.formResponses?.['startTimeHour'] && !res.locals.formResponses?.['startTimeMinute']
        ? format(courtAppearance.start, 'HH:mm').split(':')
        : []

    res.render('court-appearances/edit/date-and-time/view', {
      backUrl,
      startDate: res.locals.formResponses?.['startDate'] ?? formatInputDate(courtAppearance.start),
      startTimeHour: res.locals.formResponses?.['startTimeHour'] ?? startTimeHour,
      startTimeMinute: res.locals.formResponses?.['startTimeMinute'] ?? startTimeMinute,
    })
  }

  submitToApi = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateCourtAppearance!
    try {
      journey.result = await this.courtAppearanceSchedulerService.updateCourtAppearance(
        { res },
        journey.courtAppearance.id,
        {
          type: 'RescheduleAppearance',
          start: `${req.body.startDate}T${req.body.startTimeHour}:${req.body.startTimeMinute}:00`,
          end: `${req.body.startDate}T17:00:00`,
        },
      )
      next()
    } catch (e) {
      next(e)
    }
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.journeyData.updateCourtAppearance!
    req.journeyData.journeyCompleted = true
    res.redirect(journey.result!.content.length ? 'confirmation' : `/court-appearances/${journey.courtAppearance.id}`)
  }
}
