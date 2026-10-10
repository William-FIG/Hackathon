import type { VercelRequestLike, VercelResponseLike } from './routes/character-chat'

type DevelopmentRequest = VercelRequestLike & {
  on(event: 'data', listener: (chunk: Uint8Array | string) => void): void
  on(event: 'end' | 'error', listener: (error?: Error) => void): void
}

type CharacterChatHandler = (request: VercelRequestLike, response: VercelResponseLike) => Promise<void>

const MAX_REQUEST_BYTES = 12 * 1024

async function readJsonBody(request: DevelopmentRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    let length = 0
    request.on('data', (chunk) => {
      const bytes = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk
      length += bytes.byteLength
      if (length > MAX_REQUEST_BYTES) {
        reject(new Error('too_large'))
        return
      }
      chunks.push(bytes)
    })
    request.on('error', () => reject(new Error('invalid_body')))
    request.on('end', () => {
      try {
        const combined = new Uint8Array(length)
        let offset = 0
        for (const chunk of chunks) {
          combined.set(chunk, offset)
          offset += chunk.byteLength
        }
        resolve(JSON.parse(new TextDecoder().decode(combined)))
      } catch {
        reject(new Error('invalid_body'))
      }
    })
  })
}

function sendInvalidRequest(response: VercelResponseLike): void {
  response.statusCode = 400
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.end(JSON.stringify({ error: { code: 'invalid_request' } }))
}

/** Lets `npm run dev` serve the same server-only handler as deployment without exposing env variables. */
export function createCharacterChatDevelopmentMiddleware(handler: CharacterChatHandler) {
  return async (request: DevelopmentRequest, response: VercelResponseLike): Promise<void> => {
    if (request.method !== 'POST') {
      await handler(request, response)
      return
    }
    try {
      request.body = await readJsonBody(request)
      await handler(request, response)
    } catch {
      sendInvalidRequest(response)
    }
  }
}
