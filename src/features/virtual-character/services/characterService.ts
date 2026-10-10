import type { BookId, Lang } from '../../../types'

export type CharacterChatEvent = 'answerWrong' | 'answerCorrect'
export type CharacterChatErrorCode = 'invalid_request' | 'rate_limited' | 'not_configured' | 'timeout' | 'unavailable' | 'unsafe_output'

export interface CharacterFeedbackRequest {
  lang: Lang
  context: {
    bookId: BookId
    chapter: number
    segment: number
    event: CharacterChatEvent
    targetWord: string
    targetMeaning: string
  }
}

export class CharacterServiceError extends Error {
  constructor(readonly code: CharacterChatErrorCode) {
    super(code)
  }
}

/** Browser-side provider-neutral boundary for optional character feedback. */
export async function requestCharacterFeedback(request: CharacterFeedbackRequest, signal: AbortSignal): Promise<string> {
  const response = await fetch('/api/character-chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  let payload: { reply?: unknown; error?: { code?: unknown } } = {}
  try {
    payload = await response.json() as { reply?: unknown; error?: { code?: unknown } }
  } catch {
    throw new CharacterServiceError('unavailable')
  }
  if (response.ok && typeof payload.reply === 'string') return payload.reply

  const code = typeof payload.error?.code === 'string' ? payload.error.code : 'unavailable'
  if (code === 'invalid_request' || code === 'rate_limited' || code === 'not_configured' || code === 'timeout' || code === 'unavailable' || code === 'unsafe_output') {
    throw new CharacterServiceError(code)
  }
  throw new CharacterServiceError('unavailable')
}
