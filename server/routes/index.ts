import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import breadcrumbs from '../middleware/breadcrumbs'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  router.use(breadcrumbs())

  router.get('/', async (req, res) => {
    await auditService.logPageView(Page.HOMEPAGE, { who: res.locals.user.username, correlationId: req.id })
    return res.render('view', { showBreadcrumbs: true, currentTime: new Date() })
  })

  return router
}
