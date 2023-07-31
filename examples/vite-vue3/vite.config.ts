import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueImages from 'unplugin-vue-images/vite'

const config: UserConfig = {
  plugins: [
    Vue(),
    VueImages({
      dirs: ['src/assets/images', { others: 'src/assets/others' }],
      compiler: 'vue3',
    }),
  ],
}

export default config
