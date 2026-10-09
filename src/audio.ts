import type { Lang } from './types'

let audioContext: AudioContext | null = null
export function playCue(kind: 'correct' | 'wrong' | 'reward' | 'unlock', enabled: boolean) {
  if (!enabled || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    audioContext ||= new AudioContext()
    const notes = kind === 'wrong' ? [210, 170] : kind === 'correct' ? [520, 690] : kind === 'reward' ? [520, 660, 820] : [420, 560, 750, 990]
    notes.forEach((frequency, index) => {
      const oscillator = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const start = audioContext!.currentTime + index * 0.095
      oscillator.type = 'sine'; oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16)
      oscillator.connect(gain); gain.connect(audioContext!.destination)
      oscillator.start(start); oscillator.stop(start + 0.17)
    })
  } catch { /* Sound is optional. */ }
}

export function pickVoice(lang: Lang): { voice?: SpeechSynthesisVoice; fallback: boolean } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return { fallback: false }
  const voices = window.speechSynthesis.getVoices()
  const exact = voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase())
  if (exact) return { voice: exact, fallback: false }
  if (lang === 'zh-HK') return { voice: voices.find((voice) => voice.lang.toLowerCase().startsWith('zh')), fallback: true }
  if (lang === 'en') return { voice: voices.find((voice) => voice.lang.toLowerCase().startsWith('en')), fallback: true }
  const chinese = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'))
  return { voice: chinese, fallback: !chinese }
}

export function speakWord(word: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.voice = pickVoice('en').voice || null
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}
