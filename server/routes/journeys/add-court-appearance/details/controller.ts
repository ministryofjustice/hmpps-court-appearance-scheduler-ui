import { Request, Response } from 'express'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../services/apis/courtRegisterService'
import { SchemaType } from './schema'

export class CourtAppearanceDetailsController {
  constructor(
    private readonly courtAppearanceSchedulerService: CourtAppearanceSchedulerService,
    private readonly courtRegisterService: CourtRegisterService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { court, reason } = req.journeyData.addCourtAppearance!

    res.render('add-court-appearance/details/view', {
      backUrl: 'date-and-time',
      court: res.locals.formResponses?.['court'] ?? court?.code,
      reason: res.locals.formResponses?.['reason'] ?? reason?.code,
      courts: await this.courtRegisterService.getCourts({ res }),
      reasons: await this.courtAppearanceSchedulerService.getReasons({ res }),
    })
  }

  POST = async (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.addCourtAppearance!.court = req.body.court
    req.journeyData.addCourtAppearance!.reason = req.body.reason
    res.redirect('comments')
  }
}
