import { DEFAULT_ALIAS, DEFAULT_PATH } from '../constants'
import type { ResolvedOptions } from '../types'
import type { Context, Image } from './context'
import { compilers } from './compilers'

const URL_PREFIXES = [
  '/~images/',
  '/~images:',
  '~images/',
  '~images:',
  'virtual:images/',
  'virtual:images:',
  'virtual/images/',
  'virtual/images:',
]
const imagePathRE = new RegExp(`${URL_PREFIXES.map(v => `^${v}`).join('|')}`)

export interface ResolvedImagePath {
  alias: string
  path: string
  name: string
  ext: string
  query: Record<string, string | undefined>
}

export function isImagePath(path: string) {
  return imagePathRE.test(path)
}

export function normalizeImagePath(path: string) {
  return path.replace(imagePathRE, (match) => {
    if (match.endsWith(':'))
      return `${URL_PREFIXES[1]}:`
    return URL_PREFIXES[0]
  }).replace(/^\//, '')
}

export function generateImagePath(path: string): string {
  const questionIndex = path.indexOf('?')
  if (questionIndex === -1) {
    const dotIndex = path.indexOf('.')
    if (dotIndex === -1)
      return `${path}.vue`
    const extensionStr = path.slice(dotIndex + 1)
    const beforeStr = path.slice(0, dotIndex)
    const afterStr = `?${extensionStr}`
    return `${beforeStr}.vue${afterStr}`
  }

  const dotIndex = path.lastIndexOf('.', questionIndex)
  if (dotIndex === -1) {
    const beforeStr = path.slice(0, questionIndex)
    const afterStr = path.slice(questionIndex)
    return `${beforeStr}.vue${afterStr}`
  }
  const extensionStr = path.slice(dotIndex + 1, questionIndex)
  const beforeStr = path.slice(0, dotIndex)
  const afterStr = path.slice(questionIndex + 1)
  return `${beforeStr}.vue` + `?${extensionStr}&${afterStr}`
}

export function resolveImagePath(imagePath: string, options: ResolvedOptions): ResolvedImagePath | null {
  imagePath = imagePath.replace(imagePathRE, '').replace(/\.vue/, '')

  let alias: string = DEFAULT_ALIAS
  if (imagePath.startsWith(':')) {
    const slashIndex = imagePath.indexOf('/')
    alias = imagePath.slice(1, slashIndex)
    imagePath = imagePath.slice(slashIndex + 1)
  }

  let path: string = DEFAULT_PATH
  const dir = options.dirs.find(dir => dir.alias === alias)
  if (dir)
    path = dir.path

  let ext: string = ''
  const query: ResolvedImagePath['query'] = {}
  const questionIndex = imagePath.indexOf('?')
  if (questionIndex !== -1) {
    let queryRaw = imagePath.slice(questionIndex + 1)

    const andIndex = queryRaw.indexOf('&')
    if (andIndex !== -1) {
      ext = queryRaw.slice(0, andIndex)
      queryRaw = queryRaw.slice(andIndex + 1)
    }
    else {
      ext = queryRaw
      queryRaw = ''
    }

    imagePath = imagePath.slice(0, questionIndex)

    if (queryRaw) {
      new URLSearchParams(queryRaw).forEach((value, key) => {
        if (value === '' || value === 'true' || value === 'false')
          query[key] = (value === '' || value === 'true') ? 'true' : 'false'
        else
          query[key] = value
      })
    }
  }

  const name: string = imagePath.replace(/\//g, '-')

  return {
    alias,
    path,
    name,
    ext,
    query,
  }
}

export async function generateComponent(resolved: ResolvedImagePath, options: ResolvedOptions, context: Context) {
  let images = context.searchByName(resolved.name)
  if (!images)
    throw new Error('Cannot find images')

  images = images.filter(image => image.alias === resolved.alias)
  if (!images.length)
    throw new Error('Cannot find image')

  let image: Image

  if (images.length === 1) {
    image = images[0]
  }
  else {
    if (resolved.ext) {
      const tmpImage = images.find(image => image.ext === resolved.ext)
      if (!tmpImage)
        throw new Error('Cannot find image')
      image = tmpImage
    }
    else {
      throw new Error('Cannot find image')
    }
  }

  return compilers[options.compiler](image, resolved)
}

export function generateComponentFromPath(path: string, options: ResolvedOptions, context: Context) {
  const resolved = resolveImagePath(path, options)
  if (!resolved)
    return null
  return generateComponent(resolved, options, context)
}
