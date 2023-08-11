import process from 'node:process'
import type fs from 'node:fs'
import { parse } from 'node:path'
import { ensurePrefix, toCamelCase, toLinesCase } from '@vtrbo/utils/string'
import { isArray, isObject, isString } from '@vtrbo/utils/fn'
import fg from 'fast-glob'
import createDebugger from 'debug'
import { deepClone } from '@vtrbo/utils/object'
import type { Dir, Options } from '../types'
import { DEFAULT_ALIAS, DEFAULT_EXTENSIONS, DEFAULT_PATH, DEFAULT_PREFIX, UNPLUGIN_NAME } from './constants'
import { getAlias, getName, getNames, pathsEqual, removeSlash } from './utils'

const debug = createDebugger(`${UNPLUGIN_NAME}:content`)

export interface ImagesResolverOptions extends Omit<Options, 'compiler'> {
  /**
   * Prefix for resolving components name.
   * Set '' to disable prefix.
   *
   * @default 'img'
   */
  prefix?: string | false
}

export interface ResolvedImagesResolverOptions extends Omit<Required<ImagesResolverOptions>, 'dirs' | 'prefix'> {
  dirs: Dir[]
  prefix: string
}

interface Image {
  file: string
  alias: string
  name: string
  ext: string
  prefix: string
  names: string[]
}

export class Content {
  root = process.cwd()

  options: ResolvedImagesResolverOptions

  private _images: Record<string, Record<string, Image[]>> = {}

  private _imageFiles: string[] = []

  constructor(rawOptions: ImagesResolverOptions) {
    this.options = resolveOptions(rawOptions)
  }

  collectImage(path: string) {
    const alias = getAlias(path, this.options)
    const camelCaseAlias = toCamelCase(alias, true)

    const name = getName(path, this.options)
    const camelCaseName = toCamelCase(name, true)

    let aliasImages: Record<string, Image[]> = {}
    if (camelCaseAlias in this._images) {
      const cacheAliasImages = this._images[camelCaseAlias]
      if (cacheAliasImages)
        aliasImages = deepClone(cacheAliasImages)
    }

    const ext = parse(`/${path}`).ext.slice(1)

    const prefix = this.options.prefix

    aliasImages[camelCaseName] = [
      ...(aliasImages[camelCaseName] || []),
      {
        file: ensurePrefix(path, '/'),
        alias,
        name,
        ext,
        prefix,
        names: getNames(prefix, alias, name, ext),
      },
    ]

    this._images[camelCaseAlias] = deepClone(aliasImages)
  }

  addImage(path: string) {
    const ext = parse(`/${path}`).ext.slice(1)
    if (!this.options.extensions.includes(ext))
      return

    this.collectImage(path)
  }

  delImage(path: string) {
    const ext = parse(`/${path}`).ext.slice(1)
    if (!this.options.extensions.includes(ext))
      return

    const alias = getAlias(path, this.options)
    const camelCaseAlias = toCamelCase(alias, true)

    if (!(camelCaseAlias in this._images))
      return

    const aliasImages = this._images[camelCaseAlias]
    if (!aliasImages)
      return

    const name = getName(path, this.options)
    const camelCaseName = toCamelCase(name, true)

    if (!(camelCaseName in aliasImages))
      return

    const nameImages = aliasImages[camelCaseName]
    if (!nameImages)
      return

    const imageIndex = nameImages.findIndex(image => image.name === name && image.ext === ext)
    if (imageIndex === -1)
      return

    nameImages.splice(imageIndex, 1)

    aliasImages[camelCaseName] = deepClone(nameImages)

    this._images[camelCaseAlias] = deepClone(aliasImages)
  }

  searchImages() {
    const dirs = this.options.dirs
    const extensions = this.options.extensions.join(',')
    const sources = dirs.map(dir => `${dir.path}/**/*.{${extensions}}`)

    const imageFiles = fg.sync(sources, {
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
      cwd: this.root,
    })

    if (pathsEqual(imageFiles, this._imageFiles))
      return

    debug('image files =>', imageFiles)

    for (const imageFile of imageFiles)
      this.collectImage(imageFile)
  }

  searchImage(name: string) {
    const images = []
    for (const aliasKey in this._images) {
      const aliasImages = this._images[aliasKey]
      for (const nameKey in aliasImages)
        images.push(...aliasImages[nameKey])
    }
    for (const image of images) {
      if (image.names.includes(name)) {
        debug('image =>', image)
        return image
      }
    }
    return null
  }

  setWatcher(watcher: fs.FSWatcher) {
    watcher
      .on('add', (path) => {
        debug('add path =>', path)
        this.addImage(path)
      })
      .on('unlink', (path) => {
        debug('unlink path =>', path)
        this.delImage(path)
      })
  }
}

export function resolveOptions(options: ImagesResolverOptions = {}): ResolvedImagesResolverOptions {
  const rawPrefix = options.prefix ?? DEFAULT_PREFIX
  const prefix = rawPrefix ? toLinesCase(rawPrefix) : ''

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

  debug('resolver options =>', { prefix, dirs, extensions })

  return {
    prefix,
    dirs,
    extensions,
  }
}
