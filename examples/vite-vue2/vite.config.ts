import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import VueImages from 'unplugin-vue-images/vite'
import { ImagesResolver } from 'unplugin-vue-images/resolver'

const collectionDirs = [
  'src/assets/images',
  { others: 'src/assets/others' },
]

const config: UserConfig = {
  plugins: [
    Vue(),
    VueImages({
      dirs: collectionDirs,
      compiler: 'vue2',
    }),
    Components({
      resolvers: [
        ImagesResolver({
          prefix: false,
          dirs: collectionDirs,
        }),
      ],
    }),
  ],
}

export default config
