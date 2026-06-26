import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' 
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ipas-ai-quiz-app/',
  plugins: [
    vue(),
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline', // 🎯 強化1：強制將 PWA 註冊碼寫入網頁，確保 Safari 絕對不會漏接
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], 
        maximumFileSizeToCacheInBytes: 10485760, // 🎯 強化2：放寬到 10MB (避免題庫增加後被判定過大而拒絕快取)
        cleanupOutdatedCaches: true, // 🎯 強化3：每次更新都自動清掉沒用的舊垃圾檔案
        skipWaiting: true, // 🎯 強化4：大腦下載完「立刻」接管系統，不要在背景苦等
        clientsClaim: true // 🎯 強化5：立刻套用到所有打開的頁面，保證離線秒開
      },
      manifest: {
        name: 'iPAS AI 應用規劃師隨身刷題神器',
        short_name: 'iPAS AI 規劃師',
        description: '支援 100% 離線全真模擬考與弱點分析系統',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        start_url: '/ipas-ai-quiz-app/',
        scope: '/ipas-ai-quiz-app/',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})