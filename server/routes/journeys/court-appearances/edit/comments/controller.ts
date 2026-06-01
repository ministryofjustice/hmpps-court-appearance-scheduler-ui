import { NextFunction, Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'
import { SchemaType } from '../../../add-court-appearance/comments/schema'

export class EditCourtAppearanceCommentsController {
  constructor(private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, courtAppearance } = req.journeyData.updateCourtAppearance!

    res.render('court-appearances/edit/comments/view', {
      backUrl,
      comments: res.locals.formResponses?.['comments'] ?? courtAppearance.comments,
    })
  }

  submitToApi = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateCourtAppearance!
    try {
      journey.result = await this.courtAppearanceSchedulerService.updateCourtAppearance(
        { res },
        journey.courtAppearance.id,
        {
          type: 'ChangeAppearanceComments',
          comments: req.body.comments,
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
