import type { Image } from '../context'
import type { ResolvedImagePath } from '../loader'

export function Vue3ImageComponent(image: Image, resolved: ResolvedImagePath) {
  let attrs: string = ''

  for (const key in resolved.query)
    attrs += ` :${key}="${resolved.query[key]}" `

  return `<template>
  <img id="${image.alias}-${image.name}-${image.ext}" :src="src" ${attrs} v-bind="$attrs" />
</template>

<script setup>
import { ref } from 'vue'

const src = ref(new URL('${image.file}', import.meta.url).href)
</script>`
}
