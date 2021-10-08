import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import ViteComponents from 'vite-plugin-components'

export default defineConfig({
  plugins: [vue(), ViteComponents()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  define: {
    'process.env': {}
  }
})
