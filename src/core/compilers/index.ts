import type { ResolvedOptions } from '../../types'
import type { Compiler } from './types'
import { Vue2ImageComponent } from './vue2'
import { Vue3ImageComponent } from './vue3'

export const compilers: Record<ResolvedOptions['compiler'], Compiler> = {
  vue2: Vue2ImageComponent,
  vue3: Vue3ImageComponent,
}
