import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^rpc-websockets\/dist\/lib\/client\/websocket\.browser$/,
        replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.browser.cjs')
      },
      {
        find: /^rpc-websockets\/dist\/lib\/client\/websocket$/,
        replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.cjs')
      },
      {
        find: /^rpc-websockets\/dist\/lib\/client$/,
        replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client.cjs')
      }
    ]
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (
            id.includes('@solana/') ||
            id.includes('@wallet-standard/') ||
            id.includes('rpc-websockets') ||
            id.includes('bs58') ||
            id.includes('bn.js')
          ) {
            return 'solana-vendor'
          }

          if (
            id.includes('react/') ||
            id.includes('react-dom/') ||
            id.includes('scheduler/')
          ) {
            return 'react-vendor'
          }

          if (id.includes('react-router') || id.includes('@remix-run/')) {
            return 'router-vendor'
          }

          return 'vendor'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      },
      target: 'esnext'
    }
  }
})
