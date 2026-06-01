import { NextFunction, Request, Response } from 'express'
import { SchemaType } from './schema'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'

export class EditCourtAppearanceReasonController {
  constructor(private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, courtAppearance } = req.journeyData.updateCourtAppearance!

    res.render('court-appearances/edit/reason/view', {
      backUrl,
      reason: res.locals.formResponses?.['reason'] ?? courtAppearance.reason.code,
      reasons: await this.courtAppearanceSchedulerService.getReasons({ res }),
    })
  }

  submitToApi = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateCourtAppearance!
    try {
      journey.result = await this.courtAppearanceSchedulerService.updateCourtAppearance(
        { res },
        journey.courtAppearance.id,
        {
          type: 'RecategoriseAppearance',
          reasonCode: req.body.reason.code,
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
