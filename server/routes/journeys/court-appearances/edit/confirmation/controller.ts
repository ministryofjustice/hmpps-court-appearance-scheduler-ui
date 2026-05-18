import { Request, Response } from 'express'

export class EditCourtAppearanceConfirmationController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.journeyCompleted = true

    const { courtAppearance, historyQuery, result } = req.journeyData.updateCourtAppearance!

    res.render('court-appearances/edit/confirmation/view', {
      domainEvent: result!.content[0]!.domainEvents[0],
      courtAppearance,
      historyQuery,
    })
  }
}
