import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, LockKeyhole, Minus, Pause, Play, Plus, RotateCcw, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { books, getChapters } from '../data'
import { playCue, pickVoice, speakWord } from '../audio'
import { makeQuestions } from '../logic'
import { localizeChapter, trustDecision } from '../storyLocale'
import { narrationFallback, translator, wordMeaning } from '../i18n'
import type { BookId, BookProgress, Lang, Word } from '../types'

function HighlightedText({ text, words, onWord }: { text: string; words: Word[]; onWord: (word: Word) => void }) {
  return <>{text.split(/(\{[^}]+\})/g).map((part, index) => {
    if (!part.startsWith('{')) return <span key={index}>{part}</span>
    const word = words.find((item) => item.word === part.slice(1, -1))
    return word ? <button type="button" className="word-mark" key={index} onClick={() => onWord(word)}>{word.word}<span className="word-dot" /></button> : part
  })}</>
}

interface ReaderProps {
  bookId: BookId; lang: Lang; progress: BookProgress; update: (next: BookProgress) => void
  home: () => void; map: () => void; challenge: () => void; openChapter: (index: number, replay?: boolean) => void
  audioOn: boolean; setAudioOn: (value: boolean) => void; speed: number; setSpeed: (value: number) => void
}

export function StoryReader({ bookId, lang, progress, update, home, map, challenge, openChapter, audioOn, setAudioOn, speed, setSpeed }: ReaderProps) {
  const t = translator(lang)
  const chapters = getChapters(bookId).map((item, index) => localizeChapter(item, index, lang, books[bookId]))
  const chapter = chapters[progress.chapter]
  const segment = chapter.segments[progress.segment]
  const activeWord = books[bookId].words.find((item) => item.word === segment.focus)!
  const [choice, setChoice] = useState<string | null>(null)
  const [wrong, setWrong] = useState(false)
  const [branch, setBranch] = useState(false)
  const [openWord, setOpenWord] = useState<Word | null>(null)
  const [fontSize, setFontSize] = useState(20)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState('')
  const correct = choice === segment.focus
  const hasDecision = progress.chapter === 3 && progress.segment === 1
  const decision = trustDecision(lang)
  const decisionChoice = progress.choices?.['ch4-trust']
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => () => { if (speechAvailable) window.speechSynthesis.cancel() }, [speechAvailable, bookId, lang, progress.chapter, progress.segment])
  useEffect(() => { if (!audioOn && speechAvailable) { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false) } }, [audioOn, speechAvailable])

  function narrate() {
    if (!speechAvailable) { setVoiceNotice(t('noSpeech')); return }
    const synth = window.speechSynthesis
    if (speaking && !paused) { synth.pause(); setPaused(true); return }
    if (speaking && paused) { synth.resume(); setPaused(false); return }
    synth.cancel()
    const { voice, fallback } = pickVoice(lang)
    setVoiceNotice(fallback ? narrationFallback(lang, Boolean(voice)) : '')
    const utterance = new SpeechSynthesisUtterance(segment.text.replace(/[{}]/g, ''))
    utterance.lang = voice?.lang || (lang === 'zh-HK' ? 'zh-CN' : lang)
    utterance.voice = voice || null
    utterance.rate = speed
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    setSpeaking(true); setPaused(false)
    synth.speak(utterance)
  }
  function select(value: string) {
    if (correct) return
    const right = value === segment.focus
    setChoice(value)
    playCue(right ? 'correct' : 'wrong', audioOn)
    if (!right) { setWrong(true); setBranch(Boolean(segment.failure)); update({ ...progress, learned: [...new Set([...progress.learned, segment.focus])], missed: [...new Set([...progress.missed, segment.focus])] }) }
    else update({ ...progress, learned: [...new Set([...progress.learned, segment.focus])], mastered: wrong ? progress.mastered : [...new Set([...progress.mastered, segment.focus])], missed: progress.missed.filter((item) => item !== segment.focus) })
  }
  function next() {
    if (speechAvailable) window.speechSynthesis.cancel()
    setSpeaking(false); setPaused(false)
    if (progress.segment < chapter.segments.length - 1) update({ ...progress, segment: progress.segment + 1 })
    else challenge()
  }

  return <main className="reader-layout page-enter"><aside className="reader-side"><button className="text-back" onClick={home}><ArrowLeft size={16} /> {t('backHome')}</button><button className="side-map-link" onClick={map}><span>✦</span> {t('storyMap')} <ArrowRight size={15} /></button><div className="side-label">NOW READING</div><h2>{t('revengeTitle')}</h2><div className="side-divider" /><div className="side-label">{t('contents')}</div>{chapters.map((item, index) => <button key={item.title} className={`chapter-link ${progress.chapter === index ? 'selected' : ''}`} onClick={() => index <= progress.unlocked ? openChapter(index, progress.completed.includes(index)) : map()}><span className="chapter-num">0{index + 1}</span><span>{item.title}<small>{index > progress.unlocked ? t('locked') : progress.completed.includes(index) ? t('completed') : progress.chapter === index ? t('inProgress') : t('available')}</small></span>{index > progress.unlocked ? <LockKeyhole size={15} /> : <ChevronRight size={16} />}</button>)}<div className="side-bottom"><Sparkles size={17} /> {t('learningDrives')}</div></aside>
    <section className="reader-main"><div className="reader-top"><span>{t('storyMode')} <ChevronRight size={13} /> {books[bookId].title} <ChevronRight size={13} /> {t('chapter')} {progress.chapter + 1}</span><div><button aria-label={t('smaller')} onClick={() => setFontSize(Math.max(16, fontSize - 2))}><Minus size={16} /></button><span>AA</span><button aria-label={t('larger')} onClick={() => setFontSize(Math.min(26, fontSize + 2))}><Plus size={16} /></button></div></div><div className="reading-progress"><span style={{ width: `${((progress.segment + (correct ? 1 : 0)) / chapter.segments.length) * 100}%` }} /></div>
      <div className="reader-content"><div className="scene-banner"><img className="scene-image" src={`/story-scenes/chapter-${progress.chapter + 1}.svg`} alt={`${chapter.title} scene`} /><span className="scene-chapter">0{progress.chapter + 1} / 06</span></div><div className="episode-tag"><span /> {chapter.subtitle}</div><h1>{chapter.title}</h1><p className="chapter-intro">{chapter.teaser || t('chapterIntro')}</p><div className="story-divider"><span>✦</span></div><div className="scene-label">{lang === 'zh-CN' ? segment.eyebrow : `${String(progress.segment + 1).padStart(2, '0')} / 03`}</div>
        <div className="narration-bar"><button className="narrate-button" onClick={narrate} disabled={!audioOn || !speechAvailable}>{speaking && !paused ? <Pause size={17} /> : <Play size={17} />}{speaking ? paused ? t('resume') : t('pause') : t('narration')}</button><select aria-label="Narration speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select><button className="sound-toggle" aria-label={audioOn ? t('mute') : t('unmute')} onClick={() => setAudioOn(!audioOn)}>{audioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>{!speechAvailable && <small>{t('noSpeech')}</small>}{voiceNotice && <small>{voiceNotice}</small>}</div>
        <p className={`story-text ${speaking && !paused ? 'narrating' : ''}`} style={{ fontSize }}><HighlightedText text={segment.text} words={books[bookId].words} onWord={setOpenWord} /></p><div className="interaction-card"><div className="interaction-heading"><span className="interaction-icon"><CircleHelp size={19} /></span><div><span>{t('criticalChoice')}</span><h3>{t('chooseWord')}</h3></div><span className="interaction-count">{progress.segment + 1} / {chapter.segments.length}</span></div><div className="prompt-line">{segment.prompt}</div><div className="answer-grid">{segment.options.map((option) => <button key={option} disabled={correct} onClick={() => select(option)} className={`answer-option ${choice === option ? correct ? 'right' : 'wrong' : ''}`}><span>{option}</span>{choice === option && (correct ? <Check size={18} /> : <X size={18} />)}</button>)}</div>{choice && <div className={`answer-feedback ${correct ? 'success' : 'error'}`}><strong>{correct ? `${t('correct')} · ${activeWord.word} = ${wordMeaning(activeWord, lang)}` : t('tryAgain')}</strong><p>{correct ? branch ? segment.remedy : segment.success : segment.hint}</p></div>}{branch && !correct && segment.failure && <div className="branch-panel"><span>{t('branch')}</span><p>{segment.failure}</p></div>}{correct && hasDecision && <div className="story-decision"><strong>{decision.prompt}</strong><div>{decision.options.map((option) => <button className={decisionChoice === option.id ? 'chosen' : ''} key={option.id} onClick={() => update({ ...progress, choices: { ...progress.choices, 'ch4-trust': option.id } })}>{option.label}</button>)}</div>{decisionChoice && <p>{decision.options.find((option) => option.id === decisionChoice)?.scene}</p>}</div>}{correct && (!hasDecision || decisionChoice) && <button className="primary-button advance" onClick={next}>{progress.segment === chapter.segments.length - 1 ? t('startChallenge') : t('nextStory')} <ArrowRight size={18} /></button>}</div><div className="reader-note"><BookOpen size={16} /> {t('wordTip')}</div></div></section>
    {openWord && <div className="modal-backdrop" onClick={() => setOpenWord(null)}><div className="word-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setOpenWord(null)}><X size={18} /></button><div className="side-label">VOCABULARY CARD · {openWord.difficulty}</div><h2>{openWord.word}</h2><strong>{wordMeaning(openWord, lang)}</strong><p>{openWord.definition}</p><button className="example word-audio" disabled={!audioOn || !speechAvailable} onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); speakWord(openWord.word) }}><Volume2 size={16} /> {openWord.example}</button></div></div>}
  </main>
}

interface ChallengeProps { bookId: BookId; lang: Lang; progress: BookProgress; update: (next: BookProgress) => void; reader: () => void; map: () => void; home: () => void; nextChapter: () => void; audioOn: boolean }
export function ChapterChallenge({ bookId, lang, progress, update, reader, map, home, nextChapter, audioOn }: ChallengeProps) {
  const t = translator(lang)
  const chapters = getChapters(bookId)
  const chapter = chapters[progress.chapter]
  const [attempt, setAttempt] = useState(0)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ word: string; selected: string; correct: string }[]>([])
  const [finished, setFinished] = useState(false)
  const [earnedNow, setEarnedNow] = useState(false)
  const questions = useMemo(() => makeQuestions(bookId, chapter.quizWords, attempt, lang), [bookId, chapter.quizWords, attempt, lang])
  const question = questions[index]
  const score = answers.filter((answer) => answer.selected === answer.correct).length
  const passed = score >= 4
  function submit(value: string) {
    if (selected !== null) return
    setSelected(value)
    const right = value === question.answer
    playCue(right ? 'correct' : 'wrong', audioOn)
    update({ ...progress, learned: [...new Set([...progress.learned, question.word.word])], mastered: right ? [...new Set([...progress.mastered, question.word.word])] : progress.mastered, missed: right ? progress.missed.filter((item) => item !== question.word.word) : [...new Set([...progress.missed, question.word.word])] })
    setAnswers((previous) => [...previous, { word: question.word.word, selected: value, correct: question.answer }])
  }
  function advance() {
    if (index < questions.length - 1) { setIndex(index + 1); setSelected(null); return }
    if (score >= 4 && !progress.completed.includes(progress.chapter)) {
      update({ ...progress, unlocked: Math.min(chapters.length - 1, progress.chapter + 1), completed: [...progress.completed, progress.chapter], xp: progress.xp + 100 })
      setEarnedNow(true); playCue(progress.chapter === chapters.length - 1 ? 'reward' : 'unlock', audioOn)
    }
    setFinished(true)
  }
  function retry() { setAttempt(attempt + 1); setIndex(0); setSelected(null); setAnswers([]); setFinished(false); setEarnedNow(false) }
  return <main className="challenge-shell page-enter"><div className="challenge-nav"><button className="text-back" onClick={reader}><ArrowLeft size={16} /> {t('backStory')}</button><button className="text-back" onClick={map}>{t('storyMap')} <ArrowRight size={16} /></button></div>{!finished ? <div className="challenge-card"><div className="challenge-head"><div className="eyebrow">CHAPTER CHALLENGE · 0{progress.chapter + 1}</div><span>{index + 1} / 5</span></div><div className="challenge-track"><span style={{ width: `${(index + 1) * 20}%` }} /></div><div className="challenge-emblem">✦</div><h1>{t('challengeTitle')}</h1><p>{t('challengeBody')}</p><div className="question-box"><div className="eyebrow">QUESTION 0{index + 1}</div><h2>{question.prompt}</h2></div><div className="quiz-options">{question.options.map((option, optionIndex) => <button key={option} disabled={selected !== null} onClick={() => submit(option)} className={`${selected !== null && option === question.answer ? 'right' : ''} ${selected === option && option !== question.answer ? 'wrong' : ''}`}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}{selected !== null && option === question.answer && <Check size={18} />}</button>)}</div>{selected !== null && <div className={`quiz-explanation ${selected === question.answer ? 'success' : 'error'}`}><strong>{selected === question.answer ? t('correctFeedback') : t('wrongFeedback')}</strong><p>{question.explanation}</p></div>}{selected !== null && <button className="primary-button quiz-next" onClick={advance}>{index === 4 ? t('seeResult') : t('nextQuestion')} <ArrowRight size={17} /></button>}</div> : <div className="result-card chapter-result"><div className={`result-orbit ${passed ? 'pass' : ''}`}><span>{score}/5</span></div><div className="eyebrow">CHAPTER 0{progress.chapter + 1} · RESULT</div><h1>{passed ? progress.chapter === chapters.length - 1 ? t('storyFinished') : t('nextUnlocked') : t('almostThere')}</h1><p>{score * 20}% · {chapter.title}</p>{passed && <div className="xp-award"><Sparkles size={20} /> {earnedNow ? `+100 XP · ${t('reward')}` : t('chapterCleared')}</div>}{!passed && <div className="review-list">{answers.filter((answer) => answer.selected !== answer.correct).map((answer) => <div key={answer.word}><strong>{answer.word}</strong><span>{t('correctAnswer')}：{answer.correct}</span></div>)}</div>}<div className="result-actions">{passed ? progress.chapter < chapters.length - 1 ? <><button className="primary-button" onClick={nextChapter}>{t('enterNext')} <ArrowRight size={17} /></button><button className="ghost-button" onClick={map}>{t('storyMap')}</button></> : <button className="primary-button" onClick={home}>{t('backHome')} <ArrowRight size={17} /></button> : <><button className="primary-button" onClick={retry}><RotateCcw size={17} /> {t('retry')}</button><button className="ghost-button" onClick={reader}>{t('revisit')}</button></>}</div></div>}</main>
}
