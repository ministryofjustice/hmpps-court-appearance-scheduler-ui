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
      journey.result = await this.courtAppearanceSchedulerService.updateCourtAppearance(
        { res },
        journey.courtAppearance.id,
        {
          type: 'CancelAppearance',
        },
      )
      next()
    } catch (error) {
      const statusCode = (error as { data?: { status?: number } })?.data?.status

      if (statusCode === 404) {
        journey.result = {
          content: [
            {
              user: { username: '', name: ' ' },
              occurredAt: '',
              domainEvents: ['person.court-appearance.cancelled'],
              changes: [],
            },
          ],
        }
        next()
      } else if (statusCode === 409) {
        next({ text: JSON.stringify({ userMessage: 'This court appearance can no longer be cancelled' }) })
      } else {
        next(error)
      }
    }
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.journeyData.updateCourtAppearance!
    req.journeyData.journeyCompleted = true
    res.redirect(journey.result!.content.length ? 'confirmation' : `/court-appearances/${journey.courtAppearance.id}`)
  }
}
