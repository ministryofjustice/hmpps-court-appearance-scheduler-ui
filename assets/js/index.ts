import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as connectDps from '@ministryofjustice/hmpps-connect-dps-shared-items/dist/assets/js/all'
import Card from './card'
import { nodeListForEach } from './utils'
import { initPreventDoubleClickHyperlink } from './prevent-double-click-hyperlink'

govukFrontend.initAll()
mojFrontend.initAll()
connectDps.initAll()

var $cards = document.querySelectorAll('.card--clickable')
nodeListForEach($cards, function ($card) {
  new Card($card)
})

initPreventDoubleClickHyperlink()
