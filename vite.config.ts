import { realpathSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createCharacterChatDevelopmentMiddleware } from './server/dev-character-chat'
import { createCharacterChatHandler } from './server/routes/character-chat'

// Keep Vite's root and working directory consistent when opened through an NTFS junction.
const projectRoot = realpathSync(process.cwd())
process.chdir(projectRoot)

export default defineConfig(({ mode }) => {
  // This is used only by server middleware. Nothing from this object is injected into browser code.
  const serverEnvironment = loadEnv(mode, projectRoot, '')
  return {
    root: projectRoot,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'character-chat-development-api',
        configureServer(server) {
          server.middlewares.use(
            '/api/character-chat',
            createCharacterChatDevelopmentMiddleware(createCharacterChatHandler(serverEnvironment)),
          )
        },
      },
    ],
  }
})
