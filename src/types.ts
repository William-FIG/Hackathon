export type BookId = 'ielts' | 'cet6' | 'hkdse' | 'a1' | 'a2' | 'b1' | 'b2'
export type Lang = 'zh-CN' | 'zh-HK' | 'en'
export type Page = 'home' | 'setup' | 'map' | 'reader' | 'challenge' | 'notes' | 'progress' | 'review'

export interface Word {
  word: string
  meaning: string
  definition: string
  example: string
  difficulty: string
  meaningHK?: string
  meaningEN?: string
}

export interface Book {
  id: BookId
  title: string
  subtitle: string
  description: string
  level?: string
  focus?: string
  words: Word[]
}

export interface StorySegment {
  eyebrow: string
  text: string
  focus: string
  prompt: string
  options: string[]
  hint: string
  success: string
  failure?: string
  remedy?: string
}

export interface Chapter {
  title: string
  subtitle: string
  teaser?: string
  icon?: string
  segments: StorySegment[]
  quizWords: string[]
}

export interface BookProgress {
  unlocked: number
  chapter: number
  segment: number
  completed: number[]
  learned: string[]
  mastered: string[]
  missed: string[]
  xp: number
  positions?: number[]
  choices?: Record<string, string>
}

export interface AppProgress {
  books: Record<BookId, BookProgress>
  notesXp: number
}

export interface Concept {
  term: string
  definition: string
}
