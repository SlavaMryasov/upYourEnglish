import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/upYourEnglish/' : '/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
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
