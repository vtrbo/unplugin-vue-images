import { isArray, isObject, isString } from '@vtrbo/utils/fn'
import { toLinesCase } from '@vtrbo/utils/string'
import createDebugger from 'debug'
import type { Dir, Options } from './types'
import { DEFAULT_ALIAS, DEFAULT_EXTENSIONS, DEFAULT_PATH, DEFAULT_PREFIX, UNPLUGIN_NAME } from './core/constants'
import { removeSlash } from './core/utils'

const debug = createDebugger(`${UNPLUGIN_NAME}:resolver`)

export interface ImagesResolverOptions extends Omit<Options, 'compiler'> {
  /**
   * Prefix for resolving components name.
   * Set '' to disable prefix.
   *
   * @default 'img'
   */
  prefix?: string | false
}

interface ResolvedImagesResolverOptions extends Omit<Required<ImagesResolverOptions>, 'dirs'> {
  dirs: Dir[]
}

/**
 * Resolver for unplugin-vue-components and unplugin-auto-import
 *
 * @param options
 */
export function ImagesResolver(options: ImagesResolverOptions = {}) {
  const resolvedOptions = resolveOptions(options)
  debug('ImagesResolver resolvedOptions =>', resolvedOptions)

  return (name: string) => {
    debug('ImagesResolver name =>', name)

    return ''
  }
}

function resolveOptions(options: ImagesResolverOptions = {}): ResolvedImagesResolverOptions {
  const rawPrefix = options.prefix ?? DEFAULT_PREFIX
  const prefix = rawPrefix ? `${toLinesCase(rawPrefix)}-` : ''

  const dirs: Dir[] = []

  if (options?.dirs) {
    if (isString(options?.dirs)) {
      dirs.push({
        alias: DEFAULT_ALIAS,
        path: removeSlash(options?.dirs),
      })
    }
    else if (isArray(options?.dirs)) {
      options?.dirs.forEach((dir) => {
        if (isString(dir)) {
          dirs.push({
            alias: DEFAULT_ALIAS,
            path: removeSlash(dir),
          })
        }
        else {
          for (const alias in dir) {
            dirs.push({
              alias,
              path: removeSlash(dir[alias]),
            })
          }
        }
      })
    }
    else if (isObject(options?.dirs)) {
      for (const alias in options?.dirs) {
        dirs.push({
          alias,
          path: removeSlash(options?.dirs[alias]),
        })
      }
    }
  }

  if (!dirs.length) {
    dirs.push({
      alias: DEFAULT_ALIAS,
      path: removeSlash(DEFAULT_PATH),
    })
  }

  const extensions = options?.extensions || DEFAULT_EXTENSIONS

  return {
    prefix,
    dirs,
    extensions,
  }
}

export default ImagesResolver
