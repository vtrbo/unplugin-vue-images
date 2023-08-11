import createDebugger from 'debug'
import chokidar from 'chokidar'
import { ensureSuffix, toLinesCase } from '@vtrbo/utils/string'
import { UNPLUGIN_NAME } from './core/constants'
import { Content, type ImagesResolverOptions } from './core/content'

const debug = createDebugger(`${UNPLUGIN_NAME}:resolver`)

/**
 * Resolver for unplugin-vue-components
 *
 * @param options
 */
export function ImagesResolver(options: ImagesResolverOptions = {}) {
  const content = new Content(options)

  content.searchImages()

  content.setWatcher(chokidar.watch(content.options.dirs.map(dir => dir.path)))

  return (name: string) => {
    const lineName = toLinesCase(name)
    debug('name =>', name, lineName)
    debug('options =>', options)

    if (content.options.prefix && lineName.startsWith(ensureSuffix(content.options.prefix, '-')))
      return

    const image = content.searchImage(lineName)
    if (!image)
      return
    debug('image =>', image)

    const resolverPath = `~images:${image.alias}/${image.name}?${image.ext}`
    debug('component path =>', resolverPath)

    return resolverPath
  }
}

export { ImagesResolverOptions }

export default ImagesResolver
