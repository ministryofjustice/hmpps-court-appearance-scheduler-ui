import type { NextFunction, Request, Response } from 'express'
import { format } from 'date-fns'

export type SwitchOffBanner = {
  html: string
}

export const populateSwitchOffBanner = (_req: Request, res: Response, next: NextFunction) => {
  const dateString = format(new Date(), 'yyyy-MM-dd')
  if (dateString >= '2026-07-14') {
    res.locals.switchOffBanner = {
      html: '<p>Court appearances are now available on DPS. You can:</p><ul class="govuk-list govuk-list--bullet"><li>create court appearances</li><li>view and manage court appearances</li><li>view a prisoner\'s court appearance history</li></ul><p>Staff with View only or Management roles assigned by their Local System Administrator (LSA) can access the service. Please request this directly with your LSA. Guidance and access information can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">Courts SharePoint page</a>.</p>',
    }
  } else {
    res.locals.switchOffBanner = {
      html: '<p>On 13 July, we will be rolling out court appearances on DPS. You will be able to:</p><ul class="govuk-list govuk-list--bullet"><li>create court appearances</li><li>view and manage court appearances</li><li>view a prisoner\'s court appearance history</li></ul><p>Staff with View only or Management roles assigned by their Local System Administrator (LSA) can access the service. Please request this directly with your LSA. Guidance and access information can be found on our <a class="govuk-link" target="_blank" href="https://justiceuk.sharepoint.com/:u:/r/sites/prisons-digital/SitePages/External%20Movements%20-%20Court%20Scheduling.aspx?csf=1&web=1&e=WqkBgc">Courts SharePoint page</a>.</p>',
    }
  }

  next()
}
