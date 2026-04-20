import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    })
  ],
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
    sourcemap: false
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
