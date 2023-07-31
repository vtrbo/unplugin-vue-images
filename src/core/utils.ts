import createDebugger from 'debug'
import type { ResolvedOptions } from '../types'
import { DEFAULT_ALIAS, UNPLUGIN_NAME } from '../constants'

const debug = createDebugger(`${UNPLUGIN_NAME}:utils`)

export function getImageName(path: string, options: ResolvedOptions) {
  let name = ''
  for (const dir of options.dirs) {
    if (path.startsWith(dir.path)) {
      name = path.slice(dir.path.length + 1)
      break
    }
  }

  const dotIndex = name.indexOf('.')
  if (dotIndex !== -1)
    name = name.slice(0, dotIndex).replace(/\//g, '-')

  return name
}

export function getAlias(path: string, options: ResolvedOptions) {
  let alias = DEFAULT_ALIAS
  for (const dir of options.dirs) {
    if (path.startsWith(dir.path)) {
      alias = dir.alias
      break
    }
  }
  return alias
}

export function removeSlash(path: string) {
  if (path.startsWith('/'))
    path = path.slice(1)
  if (path.endsWith('/'))
    path = path.slice(0, path.length - 1)
  return path
}
