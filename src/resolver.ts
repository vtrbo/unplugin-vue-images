import createDebugger from 'debug'
import chokidar from 'chokidar'
import { toLinesCase } from '@vtrbo/utils/string'
import { UNPLUGIN_NAME } from './core/constants'
import { Content, type ImagesResolverOptions } from './core/content'

const debug = createDebugger(`${UNPLUGIN_NAME}:resolver`)

/**
 * Resolver for unplugin-vue-components and unplugin-auto-import
 *
 * @param options
 */
export function ImagesResolver(options: ImagesResolverOptions = {}) {
  const content = new Content(options)

  content.searchImages()

  content.setWatcher(chokidar.watch(content.options.dirs.map(dir => dir.path)))

  return (name: string) => {
    debug('name =>', name)

    const lineName = toLinesCase(name)

    if (lineName.startsWith(`${content.options.prefix}-`))
      return

    const image = content.searchImage(lineName)
    if (!image)
      return

    const resolverPath = `~images:${image.alias}/${image.name}?${image.ext}`
    debug('component path =>', resolverPath)

    return resolverPath
  }
}

export { ImagesResolverOptions }

export default ImagesResolver
