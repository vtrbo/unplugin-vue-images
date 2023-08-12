import { createUnplugin } from 'unplugin'
import chokidar from 'chokidar'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { Options } from './types'
import { UNPLUGIN_NAME } from './core/constants'
import { generateComponentFromPath, generateImagePath, isImagePath, normalizeImagePath } from './core/loader'
import { Context } from './core/context'

const unplugin = createUnplugin<Options>((options = {}) => {
  const ctx = new Context(options)

  return {
    name: UNPLUGIN_NAME,
    enforce: 'pre',
    resolveId(id) {
      if (isImagePath(id))
        return generateImagePath(normalizeImagePath(id))
      return null
    },
    loadInclude(id) {
      return isImagePath(id)
    },
    load(id) {
      if (isImagePath(id)) {
        const config = ctx.options
        return generateComponentFromPath(id, config, ctx)
      }
      return null
    },
    vite: {
      configResolved(config: ResolvedConfig) {
        ctx.setRoot(config.root)

        ctx.searchImages()

        if (config.build.watch && config.command === 'build')
          ctx.setupWatcher(chokidar.watch(ctx.options.dirs.map(dir => dir.path)))
      },
      configureServer(server: ViteDevServer) {
        ctx.setupViteServer(server)
      },
    },
  }
})

export * from './types'

export default unplugin
