import { NextFunction, Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import { components } from '../../../../@types/courtAppearanceScheduler'

export class CourtAppearanceCheckAnswersController {
  constructor(private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService) {}

  GET = async (req: Request, res: Response) => {
    req.journeyData.isCheckAnswers = true

    const { startDate, startTime, court, reason, comments } = req.journeyData.addCourtAppearance!

    res.render('add-court-appearance/check-answers/view', {
      backUrl: 'check-answers/back',
      startDate,
      startTime,
      court,
      reason,
      comments,
    })
  }

  BACK = async (req: Request, res: Response) => {
    delete req.journeyData.isCheckAnswers
    res.redirect('../comments')
  }

  submitToApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journey = req.journeyData.addCourtAppearance!

      const request: components['schemas']['ScheduleCourtAppearance'] = {
        start: `${journey.startDate}T${journey.startTime}:00`,
        end: `${journey.startDate}T17:00:00`,
        courtCode: journey.court!.code,
        reasonCode: journey.reason!.code,
      }

      if (journey.comments) request.comments = journey.comments

      journey.result = await this.courtAppearanceSchedulerService.createCourtAppearance(
        { res },
        req.journeyData.prisonerDetails!.prisonerNumber,
        request,
      )
      next()
    } catch (e) {
      next(e)
    }
  }

  POST = async (req: Request, res: Response) => {
    req.journeyData.journeyCompleted = true
    res.redirect('confirmation')
  }
}
