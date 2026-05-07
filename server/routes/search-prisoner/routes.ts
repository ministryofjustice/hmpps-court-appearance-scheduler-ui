import { Services } from '../../services'
import { BaseRouter } from '../common/routes'
import { SearchPrisonerController } from './controller'
import { validateOnGET } from '../../middleware/validation/validationMiddleware'
import { schema } from './schema'
import { requirePermissions } from '../../middleware/permissions/requirePermissions'
import { UserPermissionLevel } from '../../interfaces/hmppsUser'
import { Page } from '../../services/auditService'

export const SearchPrisonerRoutes = ({ prisonerSearchService }: Services) => {
  const { router, get } = BaseRouter()

  get(
    '/add-court-appearance',
    Page.SEARCH_PRISONER,
    requirePermissions(UserPermissionLevel.MANAGE),
    validateOnGET(schema, 'searchTerm'),
    new SearchPrisonerController(prisonerSearchService, {
      caption: 'Add a court appearance',
      action: {
        label: 'Create a court appearance',
        url: '/add-court-appearance/start/',
      },
    }).GET,
  )

  get(
    '/view-court-appearance-history',
    Page.SEARCH_PRISONER,
    requirePermissions(UserPermissionLevel.VIEW_ONLY),
    validateOnGET(schema, 'searchTerm'),
    new SearchPrisonerController(prisonerSearchService, {
      caption: 'View a prisoners court appearance history',
      action: {
        label: 'View court appearance history',
        url: '/view-court-appearance-history/',
      },
    }).GET,
  )

  return router
}
