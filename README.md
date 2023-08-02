# unplugin-vue-images 

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-images?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue-images)

Use the image resource as a component in the vue project.

## Install

```bash
npm i unplugin-vue-images
```

<details>
<summary>Vite</summary><br>

```js
// vite.config.js
import VueImages from 'unplugin-vue-images/vite'

export default defineConfig({
  plugins: [VueImages({ /* options */ })],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```js
// rollup.config.js
import VueImages from 'unplugin-vue-images/rollup'

export default {
  plugins: [VueImages({ /* options */ })],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```js
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-images/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```js
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-vue-images/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-vue-images/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>Esbuild</summary><br>

```js
// esbuild.config.js
import { build } from 'esbuild'
import VueImages from 'unplugin-vue-images/esbuild'

build({
  plugins: [VueImages({ /* options */ })],
})
```

<br></details>

## Usage

You can learn more by looking at the examples.  
[`vite-vue2`](https://github.com/vtrbo/unplugin-vue-images/tree/main/examples/vite-vue2)  
[`vite-vue3`](https://github.com/vtrbo/unplugin-vue-images/tree/main/examples/vite-vue3)  

### Without

```vue
<script>
import ImageUrl from '@/assets/image.png'
</script>

<template>
  <img :src="ImageUrl" width="120" height="120">
</template>
```

### With

```vue
<script>
import Image from '~images/image.png?width=120&height=120'
</script>

<template>
  <Image />
</template>
```

> **Note**  
> By default this plugin will import images in the `src/assets/images` path. You can customize it using the `dirs` option.  
> Import rule is `~images[:alias]/filename[.extension][?attrs]`, So you have the flexibility to import your image resources.

## Configuration

```ts
VueImages({
  // search images dirs
  // default 'src/assets/images'
  dirs: [
    // 'src/assets/images',
    // { icons: 'src/assets/icons' }
  ],

  // search images extensions
  // default ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif']
  extensions: [],

  // generate vue component version
  // support 'vue2' | 'vue3'
  // default 'vue3'
  compiler: 'vue3'
})
```

## Support [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components)

### config

```ts
// `vite.config.ts`

import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import VueImages from 'unplugin-vue-images/vite'
import { ImagesResolver } from 'unplugin-vue-images/resolver'

const collectionDirs = [
  'src/assets/images',
  { icons: 'src/assets/icons' },
]

const extensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif']

const config: UserConfig = {
  plugins: [
    Vue(),
    VueImages({
      dirs: collectionDirs,
      extensions,
      compiler: 'vue3',
    }),
    Components({
      resolvers: [
        ImagesResolver({
          // Components Prefix
          // Only those starting with prefix will be imported automatically
          // Set to false or '' disabled
          // default: 'img'
          prefix: 'img',

          // The dirs must be the same as those in plugins
          // default: 'src/assets/images'
          dirs: collectionDirs,

          // The extensions must be the same as those in plugins
          // default: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif']
          extensions,
        }),
      ],
    }),
  ],
}

export default config
```

### usage

```vue
<template>
  <div>
    <img-account />
    <img-normal-password-png />
    <img-icons-name />
  </div>
</template>
```

> **Note**  
> By default this plugin will import images in the `src/assets/images` path. You can customize it using the `dirs` option.  
> Usage rule is `[prefix-][alias-]name[-extension]`, So you have the flexibility to usage generate components.

## License

[MIT](./LICENSE) License © 2022 [Victor Bo](https://github.com/vtrbo)
