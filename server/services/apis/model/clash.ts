import { components } from '../../../@types/courtAppearanceScheduler'

export type Clash = components['schemas']['ClashResponse']['data'][0]['clashes'][0] & { type: string }
