import { Request, Response } from 'express'

export class CourtAppearanceConfirmationController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.journeyCompleted = true

    res.render('add-court-appearance/confirmation/view', {
      result: req.journeyData.addCourtAppearance!.result,
    })
  }
}
