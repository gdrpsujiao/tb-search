import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import legacy from '@vitejs/plugin-legacy'

import env from './env'

// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  plugins: [
    // legacy({
    //   targets: ['ie>=11'],
    //   // additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // }),
    vue(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'], // 省略文件后缀
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: env.API_ROOT,
        changeOrigin: true
      },
      '/taobao': {
        target: env.TAOBAO_API_ROOT,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/taobao/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/variable.scss";'
      }
    }
  }
})
