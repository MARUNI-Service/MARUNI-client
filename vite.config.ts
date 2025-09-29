import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'MARUNI - 마음이 닿는 안부',
        short_name: 'MARUNI',
        description: '노인 돌봄을 위한 AI 기반 소통 서비스',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/'
        // TODO: 아이콘 파일 추가 후 icons 배열 활성화
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/shared/components'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/constants': path.resolve(__dirname, './src/shared/constants'),
      '@/types': path.resolve(__dirname, './src/shared/types'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
