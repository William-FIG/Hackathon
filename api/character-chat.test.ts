import { describe, expect, it } from 'vitest'
import { parseCharacterChatRequest, validateCharacterReply } from './character-chat'

describe('character chat request validation', () => {
  it('keeps only the allowlisted post-answer learning context', () => {
    const request = parseCharacterChatRequest({
      message: 'Learner text is not part of the provider request',
      lang: 'en',
      ignored: 'never forwarded',
      context: {
        bookId: 'ielts',
        chapter: 1,
        segment: 2,
        event: 'answerWrong',
        targetWord: 'scrutinize',
        targetMeaning: 'examine closely',
        notes: 'never forwarded',
      },
    })

    expect(request).toEqual({
      lang: 'en',
      context: {
        bookId: 'ielts',
        chapter: 1,
        segment: 2,
        event: 'answerWrong',
        targetWord: 'scrutinize',
        targetMeaning: 'examine closely',
      },
    })
  })

  it('drops target-word context before a learner submits an answer', () => {
    const request = parseCharacterChatRequest({
      message: 'Give me a hint.',
      lang: 'zh-CN',
      context: {
        bookId: 'ielts',
        chapter: 0,
        segment: 0,
        event: 'segmentEnter',
        targetWord: 'allege',
        targetMeaning: '声称',
      },
    })

    expect(request.context.targetWord).toBeUndefined()
    expect(request.context.targetMeaning).toBeUndefined()
  })

  it('allows answer wording after completion but rejects it before an answer', () => {
    const completedRequest = parseCharacterChatRequest({
      lang: 'en',
      context: { bookId: 'ielts', chapter: 0, event: 'answerWrong' },
    })
    const enteringRequest = parseCharacterChatRequest({
      lang: 'en',
      context: { bookId: 'ielts', chapter: 0, event: 'segmentEnter' },
    })

    expect(validateCharacterReply('The correct answer is allege.', completedRequest)).toBe('The correct answer is allege.')
    expect(validateCharacterReply('The correct answer is allege.', enteringRequest)).toBeUndefined()
    expect(validateCharacterReply('Try connecting the word to the evidence in the scene.', completedRequest)).toBe('Try connecting the word to the evidence in the scene.')
  })
})
