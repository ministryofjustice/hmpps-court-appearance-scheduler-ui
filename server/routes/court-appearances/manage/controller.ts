import { Request, Response } from 'express'
import { parseAuditHistory } from '../../../views/partials/auditHistory/parseAuditHistory'
import CourtRegisterService from '../../../services/apis/courtRegisterService'
import { isCourtAppearanceEditable } from '../../../utils/utils'

export class ManageCourtAppearanceController {
  constructor(private readonly courtRegisterService: CourtRegisterService) {}

  GET = async (req: Request, res: Response) => {
    const isFromRAS = req.middleware!.courtAppearance!.origin?.source.code === 'remand-and-sentencing'

    res.render('court-appearances/manage/view', {
      showBreadcrumbs: true,
      courtAppearance: req.middleware!.courtAppearance,
      sourceName: req.middleware!.courtAppearance!.origin?.source.name,
      editable: isCourtAppearanceEditable(req.middleware!.courtAppearance!),
      cancellable: req.middleware!.courtAppearance!.status.code === 'SCHEDULED' && !isFromRAS,
      auditedActions: parseAuditHistory(
        req.middleware!.appearanceHistory!.content.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
        await this.courtRegisterService.getCourts({ res }),
      ),
    })
  }
}
