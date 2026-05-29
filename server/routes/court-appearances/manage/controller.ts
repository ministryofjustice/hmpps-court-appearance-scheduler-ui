import { Request, Response } from 'express'
import { parseAuditHistory } from '../../../views/partials/auditHistory/parseAuditHistory'
import CourtRegisterService from '../../../services/apis/courtRegisterService'

export class ManageCourtAppearanceController {
  constructor(private readonly courtRegisterService: CourtRegisterService) {}

  GET = async (req: Request, res: Response) => {
    res.render('court-appearances/manage/view', {
      showBreadcrumbs: true,
      courtAppearance: req.middleware!.courtAppearance,
      cancellable: req.middleware!.courtAppearance!.status.code === 'SCHEDULED',
      auditedActions: parseAuditHistory(
        req.middleware!.appearanceHistory!.content.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
        await this.courtRegisterService.getCourts({ res }),
      ),
    })
  }
}
