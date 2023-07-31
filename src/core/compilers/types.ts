import type { Image } from '../context'
import type { ResolvedImagePath } from '../loader'

export type Compiler = (image: Image, resolved: ResolvedImagePath) => string
