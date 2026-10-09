import { describe, expect, it, vi } from 'vitest'
import { books, getChapters } from './data'
import { loadProgress, makeQuestions, parseNotes, sampleNotes } from './logic'

describe('notes parser', () => {
  it('builds concepts from the supplied note, not the sample title', () => {
    expect(parseNotes(sampleNotes)).toHaveLength(4)
    expect(parseNotes('Orbit: The curved path of an object around a star.\nGravity: A force that attracts objects toward each other.\nMass: A measure of the amount of matter in an object.').map((item) => item.term)).toEqual(['Orbit', 'Gravity', 'Mass'])
  })
  it('ignores titles, malformed lines, and duplicate terms', () => {
    expect(parseNotes('Heading:\nKey: This explanation is long enough.\nKey: This is a duplicate explanation.\nNo definition')).toEqual([{ term: 'Key', definition: 'This explanation is long enough' }])
  })
})

describe('chapter questions', () => {
  for (const id of ['ielts', 'cet6', 'hkdse', 'a1', 'a2', 'b1', 'b2'] as const) {
    it(`uses ${id} vocabulary with a valid answer on each attempt`, () => {
      const chapter = getChapters(id)[0]
      for (const attempt of [0, 1, 2]) {
        const questions = makeQuestions(id, chapter.quizWords, attempt)
        expect(questions).toHaveLength(5)
        expect(questions.every((question) => books[id].words.includes(question.word))).toBe(true)
        expect(questions.every((question) => question.options.filter((option) => option === question.answer).length === 1)).toBe(true)
      }
    })
    it(`has six playable chapters backed by ${id} words`, () => {
      const chapters = getChapters(id)
      expect(chapters).toHaveLength(6)
      for (const chapter of chapters) {
        expect(chapter.segments).toHaveLength(3)
        expect(chapter.quizWords).toHaveLength(5)
        expect(chapter.quizWords.every((word) => books[id].words.some((item) => item.word === word))).toBe(true)
        expect(chapter.segments.every((segment) => segment.options.includes(segment.focus))).toBe(true)
      }
    })
  }
})

describe('V1 progress migration', () => {
  it('keeps completed chapters and XP while adding new books', () => {
    const book = { unlocked: 1, chapter: 1, segment: 2, completed: [0], learned: ['fabricated'], mastered: ['fabricated'], missed: [], xp: 100 }
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ books: { ielts: book, cet6: { ...book, completed: [], xp: 0 } }, notesXp: 40 }) })
    const result = loadProgress()
    expect(result.books.ielts.completed).toEqual([0])
    expect(result.books.ielts.xp).toBe(100)
    expect(result.books.ielts.positions?.[1]).toBe(2)
    expect(result.books.a1.completed).toEqual([])
    expect(result.notesXp).toBe(40)
    vi.unstubAllGlobals()
  })
})
