import process from 'node:process'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueImages from 'unplugin-vue-images/vite'
import Components from 'unplugin-vue-components/vite'
import createDebugger from 'debug'

import fg from 'fast-glob'

const debug = createDebugger('unplugin-vue-images:unplugin')

const config: UserConfig = {
  plugins: [
    Vue(),
    VueImages({
      dirs: ['src/assets/images', { others: 'src/assets/others' }],
      compiler: 'vue3',
    }),
    Components({
      resolvers: [
        (name: string) => {
          // debug('name =>', name)
          const dirs = [{ alias: 'normal', path: 'src/assets/images' }, { alias: 'others', path: 'src/assets/others' }]
          const extensions = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].join(',')
          const globs = dirs.map(dir => `${dir.path}/**/*.{${extensions}}`)
          const files = fg.sync(globs, {
            ignore: ['**/node_modules/**'],
            onlyFiles: true,
            cwd: process.cwd(),
          })
          // debug('files => ', files)
          return ''
        },
      ],
    }),
  ],
}

export default config
