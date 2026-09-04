import { Request, Response } from 'express'

export class CourtAppearanceClashesController {
  GET = async (req: Request, res: Response) => {
    const { clashes } = req.journeyData.addCourtAppearance!

    res.render('add-court-appearance/clashes/view', {
      clashes,
    })
  }

  POST = async (_req: Request, res: Response) => {
    res.redirect('comments')
  }
}
