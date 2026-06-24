import { Request, Response } from 'express'
import { parseAuditHistory } from '../../../views/partials/auditHistory/parseAuditHistory'
import CourtRegisterService from '../../../services/apis/courtRegisterService'
import { isCourtAppearanceEditable } from '../../../utils/utils'
import PrisonRegisterService from '../../../services/apis/prisonRegisterService'

export class ManageCourtAppearanceController {
  constructor(
    private readonly courtRegisterService: CourtRegisterService,
    private readonly prisonRegisterService: PrisonRegisterService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const courts = await this.courtRegisterService.getCourts({ res })
    const prisons = await this.prisonRegisterService.getPrisons({ res })

    const courtRegistryError =
      !courts &&
      req.middleware!.appearanceHistory!.content.find(({ changes }) =>
        changes?.find(({ propertyName }) => propertyName === 'courtCode'),
      )

    const prisonRegistryError =
      !prisons &&
      req.middleware!.appearanceHistory!.content.find(({ changes }) =>
        changes?.find(({ propertyName }) => propertyName === 'prisonCode'),
      )

    res.render('court-appearances/manage/view', {
      showBreadcrumbs: true,
      courtAppearance: req.middleware!.courtAppearance,
      sourceName: req.middleware!.courtAppearance!.origin?.source.name,
      editable: isCourtAppearanceEditable(req.middleware!.courtAppearance!),
      cancellable: req.middleware!.courtAppearance!.cancellable,
      auditedActions: parseAuditHistory(
        req.middleware!.appearanceHistory!.content.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
        courts ?? [],
        prisons ?? [],
      ),
      courtRegistryError,
      prisonRegistryError,
    })
  }
}
