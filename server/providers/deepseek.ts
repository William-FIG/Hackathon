import type { CharacterChatRequest } from '../routes/character-chat'

interface DeepSeekConfig {
  apiKey: string
  baseUrl: string
  model: string
  timeoutMs: number
}

export type DeepSeekErrorCode = 'not_configured' | 'timeout' | 'rate_limited' | 'unavailable'

export class DeepSeekCharacterProviderError extends Error {
  constructor(readonly code: DeepSeekErrorCode) {
    super(code)
  }
}

const MAX_RESPONSE_BYTES = 64 * 1024
const MAX_ATTEMPTS = 2

function cleanText(value: unknown, maximumLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  return cleaned && cleaned.length <= maximumLength ? cleaned : undefined
}

export function readDeepSeekConfig(environment: Record<string, string | undefined>): DeepSeekConfig | undefined {
  const apiKey = cleanText(environment.DEEPSEEK_API_KEY, 1_000)
  const baseUrl = cleanText(environment.DEEPSEEK_BASE_URL, 500)
  const model = cleanText(environment.DEEPSEEK_MODEL, 120)
  if (!apiKey || !baseUrl || !model) return undefined

  const suppliedTimeout = Number(environment.CHARACTER_CHAT_TIMEOUT_MS)
  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ''),
    model,
    timeoutMs: Number.isInteger(suppliedTimeout) && suppliedTimeout >= 3_000 && suppliedTimeout <= 30_000 ? suppliedTimeout : 15_000,
  }
}

function endpointFor(baseUrl: string): string {
  return baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`
}

function systemPrompt(request: CharacterChatRequest): string {
  const vocabularyContext = request.context.targetWord && request.context.targetMeaning
    ? `The learner has completed the interaction. Target word: ${request.context.targetWord}. Safe meaning: ${request.context.targetMeaning}.`
    : 'The learner has not completed the current vocabulary interaction. Do not reveal, guess, or imply its answer.'

  return [
    'You are PlotTwist, a virtual vocabulary study character. You are not a human.',
    `Reply only in ${request.lang}. Keep the response to two concise, encouraging sentences focused on study strategy.`,
    vocabularyContext,
    `Story context: book ${request.context.bookId}, chapter ${request.context.chapter + 1}, event ${request.context.event}.`,
    'The answer result is already determined locally. Do not evaluate unseen learner text, reveal an answer before a response, or change XP, mastery, chapter progress, or unlocks.',
    'Never ask for personal, school, location, contact, health, or financial data. Never request secrecy or emotional reliance. Return plain text only; do not use HTML or claim actions you did not perform.',
  ].join('\n')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function readResponseText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) throw new DeepSeekCharacterProviderError('unavailable')
  if (!response.body) throw new DeepSeekCharacterProviderError('unavailable')

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const next = await reader.read()
      if (next.done) break
      length += next.value.byteLength
      if (length > MAX_RESPONSE_BYTES) {
        await reader.cancel()
        throw new DeepSeekCharacterProviderError('unavailable')
      }
      chunks.push(next.value)
    }
  } finally {
    reader.releaseLock()
  }

  const combined = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    combined.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(combined)
}

function mapReply(body: string): string {
  let payload: unknown
  try {
    payload = JSON.parse(body)
  } catch {
    throw new DeepSeekCharacterProviderError('unavailable')
  }
  if (!isRecord(payload) || !Array.isArray(payload.choices) || !isRecord(payload.choices[0]) || !isRecord(payload.choices[0].message)) {
    throw new DeepSeekCharacterProviderError('unavailable')
  }
  const content = payload.choices[0].message.content
  if (typeof content !== 'string') throw new DeepSeekCharacterProviderError('unavailable')
  return content
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function isRetryable(error: unknown): boolean {
  return error instanceof DeepSeekCharacterProviderError && error.code === 'unavailable'
}

async function delayForRetry(signal: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, 250)
    const abort = () => {
      clearTimeout(timeout)
      reject(new DOMException('Request aborted', 'AbortError'))
    }
    signal.addEventListener('abort', abort, { once: true })
  })
}

export class DeepSeekCharacterProvider {
  constructor(private readonly config: DeepSeekConfig) {}

  async generate(request: CharacterChatRequest, signal: AbortSignal): Promise<string> {
    const controller = new AbortController()
    let timedOut = false
    const abort = () => controller.abort()
    signal.addEventListener('abort', abort, { once: true })
    const timeout = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, this.config.timeoutMs)

    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        try {
          const response = await fetch(endpointFor(this.config.baseUrl), {
            method: 'POST',
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: this.config.model,
              messages: [{ role: 'system', content: systemPrompt(request) }],
              max_tokens: 512,
              temperature: 0.4,
              stream: false,
            }),
          })
          if (!response.ok) {
            throw new DeepSeekCharacterProviderError(response.status === 429 ? 'rate_limited' : 'unavailable')
          }
          return mapReply(await readResponseText(response))
        } catch (error) {
          if (controller.signal.aborted || isAbortError(error)) {
            throw new DeepSeekCharacterProviderError(timedOut ? 'timeout' : 'unavailable')
          }
          if (attempt + 1 < MAX_ATTEMPTS && isRetryable(error)) {
            await delayForRetry(controller.signal)
            continue
          }
          if (error instanceof DeepSeekCharacterProviderError) throw error
          throw new DeepSeekCharacterProviderError('unavailable')
        }
      }
      throw new DeepSeekCharacterProviderError('unavailable')
    } finally {
      clearTimeout(timeout)
      signal.removeEventListener('abort', abort)
    }
  }
}
