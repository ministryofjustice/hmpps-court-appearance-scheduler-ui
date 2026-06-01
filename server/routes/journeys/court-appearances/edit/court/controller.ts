import { NextFunction, Request, Response } from 'express'
import { SchemaType } from './schema'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../../services/apis/courtRegisterService'

export class EditCourtAppearanceCourtController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, courtAppearance } = req.journeyData.updateCourtAppearance!

    res.render('court-appearances/edit/court/view', {
      backUrl,
      court: res.locals.formResponses?.['court'] ?? courtAppearance.court.code,
      courts: await this.courtRegisterService.getCourts({ res }),
    })
  }

  submitToApi = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateCourtAppearance!
    try {
      journey.result = await this.courtAppearanceSchedulerService.updateCourtAppearance(
        { res },
        journey.courtAppearance.id,
        {
          type: 'RelocateAppearance',
          courtCode: req.body.court.code,
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
