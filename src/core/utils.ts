import type { ResolvedOptions } from '../types'
import { DEFAULT_ALIAS } from './constants'
import type { ResolvedImagesResolverOptions } from './content'

export function getName(path: string, options: ResolvedOptions | ResolvedImagesResolverOptions) {
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

export function getAlias(path: string, options: ResolvedOptions | ResolvedImagesResolverOptions) {
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

export function pathsEqual(oldPaths: string[], newPaths: string[]) {
  if (oldPaths.length !== newPaths.length)
    return false

  for (let i = 0; i < oldPaths.length; i++) {
    if (!oldPaths[i].includes(newPaths[i]))
      return false
  }

  return true
}

export function getNames(prefix: string, alias: string, name: string, extension: string): string[] {
  return [
    `${prefix}-${alias}-${name}-${extension}`,
    `${prefix}-${alias}-${name}`,

    `${prefix}-${name}-${extension}`,
    `${prefix}-${name}`,

    `${alias}-${name}-${extension}`,
    `${alias}-${name}`,

    `${name}-${extension}`,

    name,
  ]
}
