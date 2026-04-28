import { Request, Response } from 'express'
import { SchemaType } from './schema'
import { formatInputDate } from '../../../../utils/dateTimeUtils'

export class CourtAppearanceDateTimeController {
  GET = async (req: Request, res: Response) => {
    const { backUrl, startDate, startTime } = req.journeyData.addCourtAppearance!

    const [startTimeHour, startTimeMinute] =
      !res.locals.formResponses?.['startTimeHour'] && !res.locals.formResponses?.['startTimeMinute'] && startTime
        ? startTime.split(':')
        : []

    res.render('add-court-appearance/date-and-time/view', {
      backUrl,
      startDate: res.locals.formResponses?.['startDate'] ?? formatInputDate(startDate),
      startTimeHour: res.locals.formResponses?.['startTimeHour'] ?? startTimeHour,
      startTimeMinute: res.locals.formResponses?.['startTimeMinute'] ?? startTimeMinute,
    })
  }

  POST = async (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.addCourtAppearance!.startDate = req.body.startDate
    req.journeyData.addCourtAppearance!.startTime = `${req.body.startTimeHour}:${req.body.startTimeMinute}`
    res.redirect('details')
  }
}
