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

  collectImage(path: string) {
    const alias = getAlias(path, this.options)
    const camelCaseAlias = toCamelCase(alias, true)

    const name = getName(path, this.options)
    const camelCaseName = toCamelCase(name, true)

    let aliasImages = new Map<string, Image[]>()
    if (this._images.has(camelCaseAlias)) {
      const cacheAliasImages = this._images.get(camelCaseAlias)
      if (cacheAliasImages)
        aliasImages = cacheAliasImages
    }

    const ext = parse(`/${path}`).ext.slice(1)

    aliasImages.set(camelCaseName, [
      ...(aliasImages.get(camelCaseName) || []),
      {
        file: ensurePrefix(path, '/'),
        alias,
        name,
        ext,
      },
    ])

    this._images.set(camelCaseAlias, aliasImages)
  }

  addImage(path: string) {
    if (!this._server)
      return

    const rootIndex = path.indexOf(this.root)
    if (rootIndex === -1)
      return

    path = path.slice(rootIndex + this.root.length + 1)

    const ext = parse(`/${path}`).ext.slice(1)
    if (!this.options.extensions.includes(ext))
      return

    this.collectImage(path)
  }

  delImage(path: string) {
    if (!this._server)
      return

    const rootIndex = path.indexOf(this.root)
    if (rootIndex === -1)
      return

    path = path.slice(rootIndex + this.root.length + 1)

    const ext = parse(`/${path}`).ext.slice(1)
    if (!this.options.extensions.includes(ext))
      return

    const alias = getAlias(path, this.options)
    const camelCaseAlias = toCamelCase(alias, true)

    if (!this._images.has(camelCaseAlias))
      return

    const aliasImages = this._images.get(camelCaseAlias)
    if (!aliasImages)
      return

    const name = getName(path, this.options)
    const camelCaseName = toCamelCase(name, true)

    if (!aliasImages.has(camelCaseName))
      return

    const nameImages = aliasImages.get(camelCaseName)
    if (!nameImages)
      return

    const imageIndex = nameImages.findIndex(image => image.name === name && image.ext === ext)
    if (imageIndex === -1)
      return

    nameImages.splice(imageIndex, 1)

    aliasImages.set(camelCaseName, nameImages)

    this._images.set(camelCaseAlias, aliasImages)
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

    for (const imageFile of imageFiles)
      this.collectImage(imageFile)

    debug('searchImages images =>', this._images)

    this._searched = true
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
        this.addImage(path)
      })
      .on('unlink', (path) => {
        this.delImage(path)
      })
  }
}
