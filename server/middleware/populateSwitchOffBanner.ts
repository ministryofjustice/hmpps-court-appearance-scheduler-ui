import type { NextFunction, Request, Response } from 'express'
import { format } from 'date-fns'

export type SwitchOffBanner = {
  html: string
}

export const populateSwitchOffBanner = (_req: Request, res: Response, next: NextFunction) => {
  const dateString = format(new Date(), 'yyyy-MM-dd')
  if (dateString >= '2026-07-14') {
    res.locals.switchOffBanner = {
      html: 'On 13th July, we will be rolling out court appearances on DPS. You will be able create court appearances, view and manage court appearances and view a prisoner’s court appearance history. Staff with View only or Management roles assigned by their Local System Administrator (LSA) can access the service. Please request this directly with your LSA. Guidance and access information can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">Courts SharePoint page</a>.',
    }
  } else {
    res.locals.switchOffBanner = {
      html: 'Court appearances are now available on DPS. You can create court appearances, view and manage court appearances and view a prisoner’s court appearance history. Staff with View only or Management roles assigned by their Local System Administrator (LSA) can access the service. Please request this directly with your LSA. Guidance and access information can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">Courts SharePoint page</a>.',
    }
  }

  next()
}
