import process from 'node:process'
import type fs from 'node:fs'
import { parse } from 'node:path'
import fg from 'fast-glob'
import type { ViteDevServer } from 'vite'
import { ensurePrefix, toCamelCase } from '@vtrbo/utils/string'
import type { Options, ResolvedOptions } from '../types'
import { resolveOptions } from './options'
import { getAlias, getImageName } from './utils'

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

  private _cache = new Map<string, Image[]>()

  private _server: ViteDevServer | undefined

  constructor(
    private rawOptions: Options,
  ) {
    this.options = resolveOptions(rawOptions)
  }

  searchGlob() {
    if (this._searched)
      return

    const extensions = this.options.extensions.join(',')
    const globs = this.options.dirs.map(dir => `${dir.path}/**/*.{${extensions}}`)

    const files = fg.sync(globs, {
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
      cwd: this.root,
    })

    for (const file of files) {
      const alias = getAlias(file, this.options)
      const name = getImageName(file, this.options)
      const ext = parse(`/${file}`).ext.slice(1)
      const camelCaseName = toCamelCase(name, true)
      this._cache.set(camelCaseName, [
        ...(this._cache.get(camelCaseName) || []),
        {
          file: ensurePrefix(file, '/'),
          alias,
          name,
          ext,
        },
      ])
    }

    this._searched = true
  }

  searchByName(name: string) {
    const camelCaseName = toCamelCase(name, true)
    if (this._cache.has(camelCaseName))
      return this._cache.get(camelCaseName)
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

      })
      .on('unlink', (path) => {

      })
  }
}
