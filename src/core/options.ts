import { isArray, isObject, isString } from '@vtrbo/utils/fn'
import createDebugger from 'debug'
import type { Dir, Options, ResolvedOptions } from '../types'
import { DEFAULT_ALIAS, DEFAULT_EXTENSIONS, DEFAULT_PATH, UNPLUGIN_NAME } from './constants'
import { removeSlash } from './utils'

const debug = createDebugger(`${UNPLUGIN_NAME}:options`)

export function resolveOptions(options: Options): ResolvedOptions {
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

  debug('resolveOptions dirs =>', dirs)

  const extensions = options?.extensions || DEFAULT_EXTENSIONS

  const compiler = options?.compiler || 'vue3'

  return {
    dirs,
    extensions,
    compiler,
  }
}
