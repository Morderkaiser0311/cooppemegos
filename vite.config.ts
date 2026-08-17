import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fork } from 'child_process'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // Start the cross-browser sync server sidecar process only in dev mode
    fork('./server.js')
  }
  
  return {
    base: './',
    plugins: [react()],
    server: {
      watch: {
        ignored: ['**/index.zip', '**/*.zip', '**/*.rar', '**/*.tar.gz'],
      },
    },
  }
})
