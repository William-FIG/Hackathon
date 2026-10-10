import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, CheckCircle2, CircleAlert, MessageCircle, Mic2, RefreshCcw, Send, Sparkles, Square, UserRound, Volume2, VolumeX, X } from 'lucide-react'
import { speakText } from '../../audio'
import { books } from '../../data'
import { wordMeaning } from '../../i18n'
import type { BookId, BookProgress, Lang, Word } from '../../types'
import { requestCharacterFeedback, CharacterServiceError, type CharacterChatErrorCode } from './services/characterService'
import { characterQuestionTemplates, oralReviewCopy, reviewAvatarSrc, reviewCharacters, reviewCopy, type ReviewCharacterId } from './reviewData'

type ReviewFilter = 'priority' | 'learned' | 'mastered' | 'all'
type OralPhase = 'ready' | 'answering' | 'feedback'
type ChatErrorCode = CharacterChatErrorCode
type OralTurn = { id: string; speaker: 'examiner' | 'learner'; source: 'local' | 'deepseek'; label: string; text: string }

interface ReviewPageProps {
  bookId: BookId
  progress: BookProgress
  lang: Lang
}

function uniqueWords(words: Word[]): Word[] {
  return words.filter((word, index) => words.findIndex((candidate) => candidate.word === word.word) === index)
}

function selectReviewWords(bookId: BookId, progress: BookProgress, filter: ReviewFilter): Word[] {
  const wordByName = new Map(books[bookId].words.map((word) => [word.word, word]))
  const toWords = (names: string[]) => names.map((name) => wordByName.get(name)).filter((word): word is Word => Boolean(word))
  const missed = toWords(progress.missed)
  const mastered = toWords(progress.mastered).filter((word) => !progress.missed.includes(word.word))
  const learned = toWords(progress.learned).filter((word) => !progress.missed.includes(word.word) && !progress.mastered.includes(word.word))
  if (filter === 'priority') return uniqueWords(missed)
  if (filter === 'learned') return uniqueWords(learned)
  if (filter === 'mastered') return uniqueWords(mastered)
  return uniqueWords([...missed, ...learned, ...mastered])
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '')
}

function evaluateAnswer(answer: string, word: Word, lang: Lang): boolean {
  const normalizedAnswer = normalize(answer)
  if (normalizedAnswer.length < 2) return false
  const expected = [wordMeaning(word, lang), word.meaning, word.meaningHK, word.meaningEN, word.definition]
    .filter((value): value is string => Boolean(value))
    .map(normalize)
    .filter((value) => value.length >= 2)
  if (expected.some((value) => normalizedAnswer.includes(value) || (normalizedAnswer.length >= 2 && value.includes(normalizedAnswer)))) return true
  const EnglishTokens = word.definition.toLowerCase().match(/[a-z]{4,}/g) || []
  return EnglishTokens.some((token) => normalizedAnswer.includes(token))
}

function errorLabel(code: ChatErrorCode, lang: Lang): string {
  const labels: Record<Lang, Record<ChatErrorCode, string>> = {
    'zh-CN': { invalid_request:'请求格式无效。', rate_limited:'请求过于频繁，请稍后再试。', not_configured:'服务器尚未配置 AI 考察。', timeout:'AI 考察超时。', unavailable:'AI 考察服务不可用。', unsafe_output:'AI 回复未通过安全检查。' },
    'zh-HK': { invalid_request:'請求格式無效。', rate_limited:'請求太頻密，請稍後再試。', not_configured:'伺服器未設定 AI 考察。', timeout:'AI 考察逾時。', unavailable:'AI 考察服務用唔到。', unsafe_output:'AI 回覆未通過安全檢查。' },
    en: { invalid_request:'The request was invalid.', rate_limited:'Too many requests. Try again shortly.', not_configured:'AI review is not configured on the server.', timeout:'AI review timed out.', unavailable:'AI review is unavailable.', unsafe_output:'The AI reply did not pass the safety check.' },
  }
  return labels[lang][code]
}

export function ReviewPage({ bookId, progress, lang }: ReviewPageProps) {
  const copy = reviewCopy[lang]
  const oral = oralReviewCopy[lang]
  const [characterId, setCharacterId] = useState<ReviewCharacterId>('lin-zhi')
  const [filter, setFilter] = useState<ReviewFilter>('priority')
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<OralPhase>('ready')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [voiceOn, setVoiceOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [consented, setConsented] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turns, setTurns] = useState<OralTurn[]>([])
  const controllerRef = useRef<AbortController | null>(null)

  const character = reviewCharacters.find((item) => item.id === characterId) ?? reviewCharacters[0]
  const categoryWords = useMemo(() => selectReviewWords(bookId, progress, filter), [bookId, progress, filter])
  const reviewWords = categoryWords.length ? categoryWords : books[bookId].words
  const target = reviewWords[round % reviewWords.length]
  const targetMeaning = wordMeaning(target, lang)
  const questionTemplates = characterQuestionTemplates[character.id][lang]
  const questionText = questionTemplates[round % questionTemplates.length]
    .replace('{word}', target.word)
    .replace('{example}', target.example)
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => () => {
    controllerRef.current?.abort()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  useEffect(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    setPhase('ready')
    setAnswer('')
    setResult(null)
    setError(null)
    setAiLoading(false)
    setTurns([])
  }, [character.id, lang, filter])

  function addExaminerTurn(text: string, source: 'local' | 'deepseek', label: string) {
    setTurns((previous) => [...previous, { id: `${source}-${Date.now()}-${previous.length}`, speaker: 'examiner', source, label, text }])
  }

  function speakQuestion(text = questionText) {
    if (!voiceOn) return
    if (!speakText(text, lang, { rate: 0.92, onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) })) setError(oral.voiceUnavailable)
  }

  function stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function startOrNextQuestion() {
    setRound((value) => phase === 'ready' ? value : value + 1)
    const nextRound = phase === 'ready' ? round : round + 1
    const nextTarget = reviewWords[nextRound % reviewWords.length]
    const nextTemplates = characterQuestionTemplates[character.id][lang]
    const nextQuestion = nextTemplates[nextRound % nextTemplates.length]
      .replace('{word}', nextTarget.word)
      .replace('{example}', nextTarget.example)
    setPhase('answering')
    setAnswer('')
    setResult(null)
    setError(null)
    addExaminerTurn(nextQuestion, 'local', `${character.name[lang]} · ${character.role[lang]}`)
    if (voiceOn) speakQuestion(nextQuestion)
  }

  function selectCharacter(id: ReviewCharacterId) {
    setCharacterId(id)
  }

  function cancelAiFeedback() {
    controllerRef.current?.abort()
    controllerRef.current = null
    setAiLoading(false)
    setError(copy.cancel)
  }

  function updateConsent(nextConsented: boolean) {
    if (!nextConsented) cancelAiFeedback()
    setConsented(nextConsented)
  }

  async function requestAiFeedback(correct: boolean) {
    if (!consented) return
    const controller = new AbortController()
    controllerRef.current = controller
    setAiLoading(true)
    setError(null)
    try {
      const reply = await requestCharacterFeedback({
        lang,
        context: {
          bookId,
          chapter: progress.chapter,
          segment: progress.segment,
          event: correct ? 'answerCorrect' : 'answerWrong',
          targetWord: target.word,
          targetMeaning,
        },
      }, controller.signal)
      addExaminerTurn(reply, 'deepseek', oral.aiFeedback)
    } catch (caught) {
      if (controller.signal.aborted) return
      const code = caught instanceof CharacterServiceError ? caught.code : 'unavailable'
      setError(`${errorLabel(code, lang)} ${character.fallbackFeedback[lang]}`)
      addExaminerTurn(character.fallbackFeedback[lang], 'local', oral.localEvaluation)
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
      setAiLoading(false)
    }
  }

  function submitAnswer() {
    const learnerAnswer = answer.trim()
    if (!learnerAnswer || phase !== 'answering') return
    const correct = evaluateAnswer(learnerAnswer, target, lang)
    setResult(correct)
    setPhase('feedback')
    setTurns((previous) => [...previous, { id: `learner-${Date.now()}-${previous.length}`, speaker: 'learner', source: 'local', label: oral.answerRecorded, text: learnerAnswer }])
    const feedback = `${correct ? character.correctFeedback[lang] : character.retryFeedback[lang]} ${correct ? oral.correct : oral.needsReview} ${target.word} · ${targetMeaning}`
    addExaminerTurn(feedback, 'local', `${character.name[lang]} · ${oral.localEvaluation}`)
    if (voiceOn) speakQuestion(feedback)
    void requestAiFeedback(correct)
  }

  return <main className="review-chat-shell oral-review-shell page-enter" aria-labelledby="review-page-title">
    <section className="review-hero oral-hero"><div><div className="eyebrow"><Sparkles size={14} /> {oral.oralMode}</div><h1 id="review-page-title">{copy.title}</h1><p>{copy.body}</p></div><div className="review-book-badge"><span>{copy.currentBook}</span><strong>{books[bookId].title}</strong><small>{oral.progressNote}</small></div></section>

    <section className="review-examiner-section" aria-labelledby="examiner-title"><div className="review-section-heading"><div><span className="eyebrow">01 / 03</span><h2 id="examiner-title">{copy.examiner}</h2></div><p>{character.approach[lang]}</p></div><div className="review-character-grid">{reviewCharacters.map((item) => <button type="button" key={item.id} className={`review-character-card ${item.id === character.id ? 'selected' : ''}`} onClick={() => selectCharacter(item.id)} aria-pressed={item.id === character.id}><img src={reviewAvatarSrc[item.id]} alt="" /><span><strong>{item.name[lang]}</strong><small>{item.role[lang]}</small></span>{item.id === character.id && <CheckCircle2 size={18} />}</button>)}</div></section>

    <section className="oral-stage" aria-label={oral.oralMode}>
      <div className="oral-avatar-column"><div className={`oral-avatar-frame ${speaking ? 'speaking' : ''}`}><img src={reviewAvatarSrc[character.id]} alt={`${character.name[lang]} ${character.role[lang]}`} /><span className="oral-speaking-indicator" aria-hidden="true"><i /><i /><i /></span></div><h2>{character.name[lang]}</h2><p>{character.role[lang]}</p><div className="oral-voice-actions">{speaking ? <button type="button" className="ghost-button" onClick={stopVoice}><Square size={15} /> {oral.stopVoice}</button> : <button type="button" className="ghost-button" onClick={() => speakQuestion()} disabled={!speechAvailable || phase === 'ready'}>{voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />} {oral.hearQuestion}</button>}<button type="button" className={`oral-voice-toggle ${voiceOn ? 'on' : ''}`} aria-label={voiceOn ? oral.stopVoice : oral.hearQuestion} onClick={() => { if (voiceOn) stopVoice(); setVoiceOn(!voiceOn) }}>{voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}</button></div>{!speechAvailable && <small className="oral-voice-notice">{oral.voiceUnavailable}</small>}</div>

      <div className="oral-conversation-column"><div className="oral-stage-head"><div><span className="eyebrow">02 / 03</span><h2><Mic2 size={20} /> {oral.oralMode}</h2></div><span>{oral.questionCounter.replace('{current}', String(round + 1)).replace('{total}', String(reviewWords.length))}</span></div><div className="review-filter-tabs" role="group" aria-label={copy.question}>{(Object.keys(copy.filters) as ReviewFilter[]).map((item) => <button type="button" key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{copy.filters[item]}</button>)}</div>
        {phase === 'ready' ? <div className="oral-welcome"><p>{character.localGreeting[lang]}</p><button type="button" className="primary-button" onClick={startOrNextQuestion}><Sparkles size={17} /> {oral.start}</button></div> : <><div className="oral-question-bubble"><span>{character.mark}</span><div><small>{oral.feedback}</small><p>{questionText}</p></div></div><label className="oral-answer-input"><span>{oral.answerRecorded}</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={phase !== 'answering'} maxLength={650} placeholder={oral.answerPrompt} /></label>{phase === 'answering' && <button type="button" className="primary-button oral-submit" onClick={submitAnswer} disabled={!answer.trim()}><Send size={16} /> {oral.submitAnswer}</button>}{phase === 'feedback' && <div className={`oral-feedback ${result ? 'correct' : 'review'}`}><strong>{result ? oral.correct : oral.needsReview}</strong><p>{target.word} · {targetMeaning}</p>{aiLoading && <small><Bot size={14} /> {oral.evaluating}</small>}{aiLoading ? <button type="button" className="ghost-button" onClick={cancelAiFeedback}><X size={15} /> {copy.cancel}</button> : <><button type="button" className="primary-button" onClick={startOrNextQuestion}><RefreshCcw size={16} /> {oral.nextQuestion}</button>{error && consented && result !== null && <button type="button" className="ghost-button" onClick={() => void requestAiFeedback(result)}><Bot size={15} /> {copy.retry}</button>}</>}</div>}</>}
        {!categoryWords.length && <p className="review-empty"><CircleAlert size={15} /> {copy.noWords} {copy.fallbackPool}</p>}</div>

      <aside className="oral-transcript-panel" aria-labelledby="oral-transcript-title"><div className="review-chat-heading"><div><span className="eyebrow">03 / 03</span><h2 id="oral-transcript-title"><MessageCircle size={19} /> {oral.transcript}</h2></div><span className="review-ai-chip"><Bot size={14} /> DeepSeek</span></div><p className="review-chat-body">{oral.consentDetail}</p><div className="review-transcript">{turns.length ? turns.map((turn) => <div key={turn.id} className={`review-message ${turn.speaker} ${turn.source}`}><span aria-hidden="true">{turn.speaker === 'examiner' ? character.mark : <UserRound size={14} />}</span><div><small>{turn.label}</small><p>{turn.text}</p></div></div>) : <div className="oral-transcript-empty"><Bot size={24} /><p>{character.localGreeting[lang]}</p></div>}</div><div className="review-live-status" aria-live="polite">{error || ''}</div><label className="review-consent"><input type="checkbox" checked={consented} onChange={(event) => updateConsent(event.target.checked)} /><span><strong>{oral.consent}</strong><small>{oral.consentDetail}</small></span></label></aside>
    </section>
  </main>
}
