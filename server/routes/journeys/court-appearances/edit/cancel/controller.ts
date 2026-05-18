import { NextFunction, Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'

export class CourtAppearanceCancelController {
  constructor(private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService) {}

  GET = async (req: Request, res: Response) => {
    const { backUrl, courtAppearance } = req.journeyData.updateCourtAppearance!

    res.render('court-appearances/edit/cancel/view', { backUrl, courtAppearance })
  }

  submitToApi = async (req: Request, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateCourtAppearance!
    try {
      await this.courtAppearanceSchedulerService.updateCourtAppearance({ res }, journey.courtAppearance.id, {
        type: 'CancelAppearance',
      })
      journey.result = {
        content: [
          {
            domainEvents: ['person.court-appearance.cancelled'],
            user: {
              username: '',
              name: '',
            },
            occurredAt: '',
            changes: [],
          },
        ],
      }
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
