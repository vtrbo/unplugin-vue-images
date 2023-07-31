import type { Image } from '../context'
import type { ResolvedImagePath } from '../loader'

export function Vue2ImageComponent(image: Image, resolved: ResolvedImagePath) {
  let attrs: string = ''

  for (const key in resolved.query)
    attrs += ` :${key}="${resolved.query[key]}" `

  return `<template>
  <img id="${image.alias}-${image.name}-${image.ext}" :src="src" ${attrs} v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  data() {
    return {
      src: new URL('${image.file}', import.meta.url).href
    }
  }
}
</script>`
}
