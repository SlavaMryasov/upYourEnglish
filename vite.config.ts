import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4000,
    proxy: {
      '/gdoc': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/gdoc/, ''),
      },
    },
  },
})
