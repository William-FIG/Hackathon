import { books } from './data'
import type { AppProgress, BookId, BookProgress, Concept, Word } from './types'

const KEY = 'plottwist-progress-v1'

function freshBook(): BookProgress {
  return { unlocked: 0, chapter: 0, segment: 0, completed: [], learned: [], mastered: [], missed: [], xp: 0 }
}

export function freshProgress(): AppProgress {
  return { books: Object.fromEntries(Object.keys(books).map((id) => [id, freshBook()])) as AppProgress['books'], notesXp: 0 }
}

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return freshProgress()
    const data = JSON.parse(raw) as AppProgress
    if (!data?.books?.ielts || !data?.books?.cet6 || typeof data.notesXp !== 'number') return freshProgress()
    const defaults = freshProgress()
    for (const id of Object.keys(books) as BookId[]) {
      const old = data.books[id]
      if (!old) continue
      defaults.books[id] = {
        ...freshBook(), ...old,
        unlocked: Math.max(0, Math.min(5, old.unlocked || 0)),
        chapter: Math.max(0, Math.min(5, old.chapter || 0)),
        segment: Math.max(0, Math.min(2, old.segment || 0)),
        positions: old.positions || [old.chapter === 0 ? old.segment : 0, old.chapter === 1 ? old.segment : 0],
      }
    }
    defaults.notesXp = data.notesXp
    return defaults
  } catch {
    return freshProgress()
  }
}

export function saveProgress(progress: AppProgress): void {
  try { localStorage.setItem(KEY, JSON.stringify(progress)) } catch { /* Storage can be unavailable in private mode. */ }
}

export function addUnique(list: string[], value: string): string[] {
  return list.includes(value) ? list : [...list, value]
}

export function markWord(progress: BookProgress, word: string, correct: boolean): BookProgress {
  return {
    ...progress,
    learned: addUnique(progress.learned, word),
    mastered: correct ? addUnique(progress.mastered, word) : progress.mastered,
    missed: correct ? progress.missed.filter((item) => item !== word) : addUnique(progress.missed, word),
  }
}

export interface Question {
  word: Word
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

export function makeQuestions(bookId: BookId, words: string[], attempt: number, lang: import('./types').Lang = 'zh-CN'): Question[] {
  const bank = books[bookId].words
  const byWord = (word: string) => bank.find((item) => item.word === word)!
  const rotated = [...words.slice(attempt % words.length), ...words.slice(0, attempt % words.length)]
  return rotated.map((word, index) => {
    const target = byWord(word)
    const distractors = bank.filter((item) => item.word !== word)
    const offset = (attempt * 3 + index * 2) % distractors.length
    const picks = [distractors[offset], distractors[(offset + 3) % distractors.length], distractors[(offset + 5) % distractors.length]]
    const meaning = (index + attempt) % 2 === 0
    const meaningFor = (item: Word) => lang === 'en' ? (item.meaningEN || item.definition) : lang === 'zh-HK' ? (item.meaningHK || item.meaning) : item.meaning
    const values = meaning ? [meaningFor(target), ...picks.map(meaningFor)] : [target.word, ...picks.map((item) => item.word)]
    const shift = (index + attempt) % values.length
    return {
      word: target,
      prompt: meaning ? (lang === 'en' ? `What does “${target.word}” mean in this story?` : lang === 'zh-HK' ? `「${target.word}」喺故事入面係咩意思？` : `“${target.word}” 在剧情中的意思是？`) : target.example.replace(new RegExp(`\\b${target.word}\\b`, 'i'), '______'),
      options: [...values.slice(shift), ...values.slice(0, shift)],
      answer: meaning ? meaningFor(target) : target.word,
      explanation: `${target.word} · ${meaningFor(target)} · ${target.definition}.`,
    }
  })
}

export function parseNotes(input: string): Concept[] {
  const concepts: Concept[] = []
  for (const raw of input.split(/\r?\n/)) {
    const line = raw.replace(/^\s*[-*•\d.()]+\s*/, '').trim()
    const match = line.match(/^([^:：—–]{2,60})\s*[:：—–]\s*(.{8,500})$/)
    if (!match) continue
    const term = match[1].trim()
    const definition = match[2].trim().replace(/[.。]$/, '')
    if (!term || !definition || concepts.some((item) => item.term.toLowerCase() === term.toLowerCase())) continue
    concepts.push({ term, definition })
  }
  return concepts.slice(0, 20)
}

export const sampleNotes = `Database Management:
Primary Key: A field that uniquely identifies each record.
Foreign Key: A field that references a key in another table.
INNER JOIN: Returns rows with matching values in both tables.
LEFT JOIN: Returns all rows from the left table and matching rows from the right table.`
