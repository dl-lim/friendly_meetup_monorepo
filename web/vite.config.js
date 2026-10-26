import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const heroDir = join(process.cwd(), 'public/assets/hero')
const imageExt = /\.(jpe?g|png|webp|gif)$/i

function heroImages() {
  try {
    return readdirSync(heroDir)
      .filter((name) => imageExt.test(name))
      .map((name) => `/assets/hero/${encodeURIComponent(name)}`)
  } catch {
    return []
  }
}

function heroImagesPlugin() {
  return {
    name: 'hero-images',
    resolveId(id) {
      if (id === 'virtual:hero-images') return id
    },
    load(id) {
      if (id === 'virtual:hero-images') return `export default ${JSON.stringify(heroImages())}`
    },
    configureServer(server) {
      server.watcher.add(heroDir)
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(heroDir)) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), heroImagesPlugin()],
  server: {
    proxy: { '/api': 'http://localhost:8080' },
  },
})
