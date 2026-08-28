import type { NextFunction, Request, Response } from 'express'
import { format } from 'date-fns'

export type SwitchOffBanner = {
  html: string
}

export const populateSwitchOffBanner = (_req: Request, res: Response, next: NextFunction) => {
  const dateString = format(new Date(), 'yyyy-MM-dd')
  if (dateString < '2026-09-20') {
    res.locals.switchOffBanner = {
      html: '<p>Following the rollout of the court appearance scheduler on DPS, the corresponding NOMIS screens will be switched off on Wed 30th September. This will not affect court appearances created from the court case service.</p><p>If you need access, contact your Local System Administrator for either the view only role or management role.  Information and guidance can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">SharePoint page</a>, but if you have any further questions, please contact us at <a class="govuk-link" href="mailto:external-movements-rollout@justice.gov.uk">external-movements-rollout@justice.gov.uk</a>>.</p>',
    }
  } else if (dateString >= '2026-09-20' && dateString <= '2026-10-19') {
    res.locals.switchOffBanner = {
      html: '<p>We have switched off the court appearances screens on NOMIS. You must now use DPS to manage court appearances, by selecting the ‘court appearances’ tile on the DPS homepage. This will not affect court appearances created from the court case service</p><p>If you need access, contact your Local System Administrator for either the view only role or management role.  Information and guidance can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">SharePoint page</a>, but if you have any further questions, please contact us at <a class="govuk-link" href="mailto:external-movements-rollout@justice.gov.uk">external-movements-rollout@justice.gov.uk</a>>.</p>',
    }
  }

  next()
}
