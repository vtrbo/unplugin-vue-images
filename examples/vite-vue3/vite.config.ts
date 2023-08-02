import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import VueImages from 'unplugin-vue-images/vite'
import { ImagesResolver } from 'unplugin-vue-images/resolver'

const collectionDirs = [
  'src/assets/images',
  { svg: 'src/assets/svg' },
]

const config: UserConfig = {
  plugins: [
    Vue(),
    VueImages({
      dirs: collectionDirs,
      compiler: 'vue3',
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
