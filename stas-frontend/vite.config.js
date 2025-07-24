import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

// ✅ Replace this line:
// import NodePolyfills from 'vite-plugin-node-polyfills'
// ❌ That package no longer works as expected (or is not maintained)

export default defineConfig({
  plugins: [
    react(),
    // 👇 Use rollup polyfill instead of Vite plugin
    {
      ...rollupNodePolyFill(),
      apply: 'build',
    },
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
})