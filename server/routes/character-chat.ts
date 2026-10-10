import { DeepSeekCharacterProvider, DeepSeekCharacterProviderError, readDeepSeekConfig } from '../providers/deepseek'

export type Language = 'zh-CN' | 'zh-HK' | 'en'
export type CharacterEvent = 'segmentEnter' | 'answerWrong' | 'answerCorrect' | 'wordMastered' | 'quizCorrect' | 'quizWrong' | 'chapterPassed' | 'chapterRetry'
type ErrorCode = 'invalid_request' | 'method_not_allowed' | 'rate_limited' | 'not_configured' | 'timeout' | 'unavailable' | 'unsafe_output'

export interface VercelRequestLike {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
  on?: (event: 'aborted' | 'close', listener: () => void) => void
  off?: (event: 'aborted' | 'close', listener: () => void) => void
}

export interface VercelResponseLike {
  statusCode: number
  setHeader(name: string, value: string | number): void
  end(body?: string): void
}

export interface CharacterChatRequest {
  lang: Language
  context: {
    bookId: string
    chapter: number
    segment?: number
    event: CharacterEvent
    targetWord?: string
    targetMeaning?: string
  }
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const MAX_WORD_LENGTH = 80
const MAX_MEANING_LENGTH = 240
const MAX_REPLY_LENGTH = 1_400
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 10
const rateLimits = new Map<string, RateLimitEntry>()
const languages = new Set<Language>(['zh-CN', 'zh-HK', 'en'])
const characterEvents = new Set<CharacterEvent>([
  'segmentEnter', 'answerWrong', 'answerCorrect', 'wordMastered',
  'quizCorrect', 'quizWrong', 'chapterPassed', 'chapterRetry',
])

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function cleanText(value: unknown, maximumLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  return cleaned && cleaned.length <= maximumLength ? cleaned : undefined
}

function parseInteger(value: unknown, minimum: number, maximum: number): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum ? value : undefined
}

/** Validates the strict public request shape and drops unsupported data before it reaches a provider. */
export function parseCharacterChatRequest(body: unknown): CharacterChatRequest {
  const input = asRecord(body)
  const context = asRecord(input?.context)
  const lang = input?.lang
  const bookId = cleanText(context?.bookId, 32)
  const chapter = parseInteger(context?.chapter, 0, 5)
  const segment = context?.segment === undefined ? undefined : parseInteger(context.segment, 0, 2)
  const event = context?.event

  if (!languages.has(lang as Language) || !bookId || chapter === undefined || !characterEvents.has(event as CharacterEvent) || (context?.segment !== undefined && segment === undefined)) {
    throw new Error('invalid_request')
  }

  // Before an answer is submitted, do not let target-word data become an answer hint.
  const canUseVocabularyContext = event !== 'segmentEnter'
  const targetWord = canUseVocabularyContext ? cleanText(context?.targetWord, MAX_WORD_LENGTH) : undefined
  const targetMeaning = canUseVocabularyContext ? cleanText(context?.targetMeaning, MAX_MEANING_LENGTH) : undefined
  return { lang: lang as Language, context: { bookId, chapter, segment, event: event as CharacterEvent, targetWord, targetMeaning } }
}

/** Rejects text that breaks the virtual character's safety and non-answer-revelation contract. */
export function validateCharacterReply(value: unknown, request: CharacterChatRequest): string | undefined {
  const reply = cleanText(value, MAX_REPLY_LENGTH)
  if (!reply) return undefined
  const prohibited = [
    /(?:do not|don't) tell (?:anyone|your)/i,
    /keep (?:this|it) secret/i,
    /i am (?:a )?(?:real )?(?:human|person)/i,
    /(?:home )?address|phone number|email address/i,
  ]
  const answerReveal = [
    /(?:the\s+)?correct\s+answer\s+(?:is|=)/i,
    /正确答案(?:是|为)/,
    /答案(?:是|为)/,
  ]
  if (prohibited.some((pattern) => pattern.test(reply))) return undefined
  // Answer wording is allowed only after a deterministic interaction has completed.
  if (request.context.event === 'segmentEnter' && answerReveal.some((pattern) => pattern.test(reply))) return undefined
  if (request.context.event === 'segmentEnter' && request.context.targetWord && new RegExp(`\\b${escapeRegExp(request.context.targetWord)}\\b`, 'i').test(reply)) return undefined
  return reply
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getClientKey(headers: VercelRequestLike['headers']): string {
  const forwarded = headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return raw?.split(',')[0]?.trim().slice(0, 80) || 'anonymous'
}

function isRateLimited(clientKey: string, now: number): boolean {
  for (const [key, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(key)
  const entry = rateLimits.get(clientKey)
  if (!entry || entry.resetAt <= now) {
    rateLimits.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_REQUESTS_PER_WINDOW
}

function sendJson(response: VercelResponseLike, status: number, body: Record<string, unknown>): void {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.end(JSON.stringify(body))
}

function sendError(response: VercelResponseLike, status: number, code: ErrorCode): void {
  sendJson(response, status, { error: { code } })
}

function runtimeEnvironment(): Record<string, string | undefined> {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
}

export function createCharacterChatHandler(environment: Record<string, string | undefined> = runtimeEnvironment()) {
  return async function characterChat(request: VercelRequestLike, response: VercelResponseLike): Promise<void> {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST')
      sendError(response, 405, 'method_not_allowed')
      return
    }

    let input: CharacterChatRequest
    try {
      input = parseCharacterChatRequest(request.body)
    } catch {
      sendError(response, 400, 'invalid_request')
      return
    }

    if (isRateLimited(getClientKey(request.headers), Date.now())) {
      sendError(response, 429, 'rate_limited')
      return
    }

    const config = readDeepSeekConfig(environment)
    if (!config) {
      sendError(response, 503, 'not_configured')
      return
    }

    const controller = new AbortController()
    const abort = () => controller.abort()
    request.on?.('aborted', abort)
    try {
      const reply = validateCharacterReply(await new DeepSeekCharacterProvider(config).generate(input, controller.signal), input)
      if (!reply) {
        sendError(response, 422, 'unsafe_output')
        return
      }
      sendJson(response, 200, { reply, source: 'deepseek' })
    } catch (error) {
      const code = error instanceof DeepSeekCharacterProviderError ? error.code : 'unavailable'
      sendError(response, code === 'timeout' ? 504 : code === 'rate_limited' ? 429 : 503, code)
    } finally {
      request.off?.('aborted', abort)
    }
  }
}

export default createCharacterChatHandler()
