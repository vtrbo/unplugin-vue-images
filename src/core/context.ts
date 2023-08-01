import process from 'node:process'
import type fs from 'node:fs'
import { parse } from 'node:path'
import fg from 'fast-glob'
import type { ViteDevServer } from 'vite'
import { ensurePrefix, toCamelCase } from '@vtrbo/utils/string'
import createDebugger from 'debug'
import type { Options, ResolvedOptions } from '../types'
import { UNPLUGIN_NAME } from '../constants'
import { resolveOptions } from './options'
import { getAlias, getName } from './utils'

const debug = createDebugger(`${UNPLUGIN_NAME}:context`)

export interface Image {
  file: string
  alias: string
  name: string
  ext: string
}

export class Context {
  root = process.cwd()

  options: ResolvedOptions

  private _searched = false

  private _images = new Map<string, Map<string, Image[]>>()

  private _server: ViteDevServer | undefined

  constructor(
    private rawOptions: Options,
  ) {
    this.options = resolveOptions(rawOptions)
  }

  searchImages() {
    if (this._searched)
      return

    const dirs = this.options.dirs
    const extensions = this.options.extensions.join(',')
    const sources = dirs.map(dir => `${dir.path}/**/*.{${extensions}}`)

    const imageFiles = fg.sync(sources, {
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
      cwd: this.root,
    })
    debug('searchImages imageFiles =>', imageFiles)

    for (const imageFile of imageFiles) {
      const alias = getAlias(imageFile, this.options)
      const camelCaseAlias = toCamelCase(alias, true)

      const name = getName(imageFile, this.options)
      const camelCaseName = toCamelCase(name, true)

      let nameMap = new Map<string, Image[]>()
      if (this._images.has(camelCaseAlias)) {
        const cacheNameMap = this._images.get(camelCaseAlias)
        if (cacheNameMap)
          nameMap = cacheNameMap
      }

      const ext = parse(`/${imageFile}`).ext.slice(1)

      nameMap.set(camelCaseName, [
        ...(nameMap.get(camelCaseName) || []),
        {
          file: ensurePrefix(imageFile, '/'),
          alias,
          name,
          ext,
        },
      ])
      debug('searchImages nameMap =>', nameMap)

      this._images.set(camelCaseAlias, nameMap)
      debug('searchImages this._images =>', this._images)

      this._searched = true
    }
  }

  searchImage(alias: string, name: string, extension: string) {
    const camelCaseAlias = toCamelCase(alias, true)
    if (!this._images.has(camelCaseAlias))
      return null

    const camelCaseName = toCamelCase(name, true)
    const aliasImages = this._images.get(camelCaseAlias)
    if (!aliasImages || !aliasImages.has(camelCaseName))
      return null

    const nameImages = aliasImages.get(camelCaseName)
    if (!nameImages || !nameImages.length)
      return null

    debug('searchImage nameImages =>', nameImages)

    if (!extension)
      return nameImages[0]

    const extImage = nameImages.find(image => image.ext === extension)
    if (!extImage)
      return null // TODO 这里当后缀无法匹配的时候，是不是可以考虑返回第一个

    return extImage
  }

  setRoot(root: string) {
    if (this.root === root)
      return

    this.root = root
    this.options = resolveOptions(this.rawOptions)
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: fs.FSWatcher) {
    watcher
      .on('add', (path) => {
        debug('setupWatcher add path =>', path)
      })
      .on('unlink', (path) => {
        debug('setupWatcher unlink path =>', path)
      })
  }
}
