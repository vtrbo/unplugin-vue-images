# unplugin-vue-images 

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-images?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-vue-images)

unplugin-vue-images for [unplugin](https://github.com/unjs/unplugin).

## Template Usage

> example use [@vtrbo/cli](https://github.com/vtrbo/cli)  
>
> example use [@vtrbo/ni](https://github.com/vtrbo/ni)  

Clone this template

```bash
vtr
# select Unplugin

# or
# vtr vtrbo/starter-unplugin my-plugin
```

Globally replace `unplugin-vue-images` with your plugin name.  

Globally replace `VueImages` with your plugin name (big camel case).  

Then you can start developing your plugin.  

To test your plugin, run `nr dev`.  

To release your plugin, run `nr release`.  

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

## License

[MIT](./LICENSE) License © 2022 [Victor Bo](https://github.com/vtrbo)
