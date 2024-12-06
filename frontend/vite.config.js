import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable in development mode if needed
      },
      manifest: {
        name: 'Soul Share',
        short_name: 'Soul Share App',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: './soul_share.svg',
            sizes: '236x96',
            type: 'image/svg'
          },
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: '5173'
  },

  preview: {
    port: '5174'
  },
  base: '/',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: true
      },
    },
    outDir: '../dist/frontend',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Set the limit in KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['node_modules', 'dist', 'build'], // Exclude directories from being watched
  },
})
