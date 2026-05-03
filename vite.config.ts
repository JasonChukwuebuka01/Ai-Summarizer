import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep the background and content scripts as simple filenames
          // so the manifest.json can find them easily
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return 'src/[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
})