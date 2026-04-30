import { Request, Response } from 'express'
import { SchemaType } from './schema'

export class CourtAppearanceCommentsController {
  GET = async (req: Request, res: Response) => {
    const { comments } = req.journeyData.addCourtAppearance!

    res.render('add-court-appearance/comments/view', {
      backUrl: 'details',
      comments: res.locals.formResponses?.['comments'] ?? comments,
    })
  }

  POST = async (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.addCourtAppearance!.comments = req.body.comments
    res.redirect('check-answers')
  }
}
