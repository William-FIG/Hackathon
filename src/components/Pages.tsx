import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Compass, LockKeyhole, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { books, getChapters } from '../data'
import { bookDescription, translator, wordMeaning } from '../i18n'
import { localizeChapter } from '../storyLocale'
import type { AppProgress, BookId, BookProgress, Lang } from '../types'

const ids = Object.keys(books) as BookId[]

type EntryLevel = 'secondary' | 'dse' | 'ielts'
type EntryStage = 'profile' | 'test' | 'result'

const diagnosticQuestions = [
  { prompt: 'If I ___ earlier, I would have caught the train.', options: ['leave', 'left', 'had left', 'leaving'], answer: 2 },
  { prompt: 'The word “corroborate” is closest to…', options: ['hide a secret', 'support with evidence', 'make someone angry', 'leave quickly'], answer: 1 },
  { prompt: 'Choose the best sentence.', options: ['She suggest to go.', 'She suggested going.', 'She suggesting go.', 'She suggest going yesterday.'], answer: 1 },
  { prompt: 'Although the evidence was ___, the lawyer found a second source.', options: ['ambiguous', 'hungry', 'wooden', 'silent'], answer: 0 },
  { prompt: '“The policy was implemented despite strong opposition” means…', options: ['It was cancelled before debate.', 'It was used even though many disagreed.', 'Nobody knew about it.', 'It was written by students.'], answer: 1 },
  { prompt: 'By the time the meeting started, the team ___ the evidence.', options: ['reviewed', 'has reviewed', 'had reviewed', 'reviewing'], answer: 2 },
  { prompt: 'The word “resilient” describes someone who…', options: ['recovers after difficulty', 'avoids all decisions', 'speaks very quietly', 'forgets every detail'], answer: 0 },
  { prompt: 'If she ___ the warning, the mistake would not have happened.', options: ['reads', 'had read', 'will read', 'reading'], answer: 1 },
  { prompt: 'Choose the most natural sentence.', options: ['The evidence was carefully examined.', 'The evidence carefully was examine.', 'The evidence examine careful.', 'The evidence was examining carefully.'], answer: 0 },
  { prompt: 'To “scrutinize” a document means to…', options: ['sign it quickly', 'hide it from everyone', 'examine it closely', 'translate it into music'], answer: 2 },
]

let lastDiagnosticSignature = ''
function shuffledDiagnosticQuestions() {
  let questions: typeof diagnosticQuestions = []
  let signature = ''
  do {
    questions = [...diagnosticQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
    signature = questions.map((question) => question.prompt).join('|')
  } while (signature === lastDiagnosticSignature)
  lastDiagnosticSignature = signature
  return questions
}

function entryLabels(lang: Lang) {
  if (lang === 'en') return {
    eyebrow: 'YOUR LEVEL · BEFORE THE ADVENTURE', title: 'Find your starting point.', body: 'Tell us where you are and where you want to go. If you are unsure, take a friendly five-question check.', back: 'Back home', current: 'My current level', target: 'My target', secondary: 'Secondary school English', dse: 'HKDSE English', ielts: 'IELTS English', notSure: "I don't know my level", continue: 'Continue', testTitle: 'Quick level check', testBody: 'No timer. No penalty. Choose the answer that feels right.', question: 'Question', next: 'Next question', see: 'See my recommendation', result: 'Your recommended starting point', resultBody: 'This is a guide, not an exam. You can change your book any time.', use: 'Use this level', choose: 'Choose a book myself', score: 'Your score', targetHint: 'Choose the destination you want to reach.', currentHint: 'Choose the closest description, or let us check for you.'
  }
  if (lang === 'zh-HK') return {
    eyebrow: '入場定位 · 冒險開始前', title: '先搵到你嘅起點。', body: '話畀我哋知你而家喺邊度、想去邊度。如果唔肯定，可以做個五題小測。', back: '返去首頁', current: '我而家嘅程度', target: '我嘅目標', secondary: '中學英文', dse: 'HKDSE 英文', ielts: 'IELTS 英文', notSure: '我唔知自己咩程度', continue: '繼續', testTitle: '五題小測', testBody: '冇限時、答錯唔扣分，揀你覺得最啱嘅答案。', question: '第', next: '下一題', see: '睇我嘅推薦程度', result: '你嘅推薦起點', resultBody: '呢個只係學習建議，唔係正式考試；之後可以隨時改詞書。', use: '使用呢個程度', choose: '自己揀詞書', score: '你嘅分數', targetHint: '揀你想達到嘅目標。', currentHint: '揀最似你嘅描述，或者交畀小測幫你判斷。'
  }
  return {
    eyebrow: '入门定位 · 冒险开始前', title: '先找到你的起点。', body: '告诉我们你现在在哪里、想去哪里。如果不确定，可以做一个五题小测。', back: '返回首页', current: '我现在的程度', target: '我的目标', secondary: '中学英语', dse: 'HKDSE 英语', ielts: 'IELTS 英语', notSure: '我不清楚自己的程度', continue: '继续', testTitle: '五题小测', testBody: '没有限时，答错不扣分，选择你觉得最合适的答案。', question: '第', next: '下一题', see: '查看我的推荐程度', result: '你的推荐起点', resultBody: '这只是学习建议，不是正式考试；之后可以随时更改词书。', use: '使用这个程度', choose: '自己选择词书', score: '你的分数', targetHint: '选择你想达到的目标。', currentHint: '选择最接近你的描述，或让小测帮你判断。'
  }
}

function bookForEntry(level: EntryLevel): BookId { return level === 'ielts' ? 'ielts' : level === 'dse' ? 'hkdse' : 'a2' }
function bookForScore(score: number): BookId { return score >= 5 ? 'ielts' : score === 4 ? 'b2' : score === 3 ? 'b1' : score === 2 ? 'a2' : 'a1' }

function EntryQuiz({ lang, setBookId, back, onDone, initialStage = 'profile' }: { lang: Lang; setBookId: (id: BookId) => void; back: () => void; onDone: () => void; initialStage?: EntryStage }) {
  const copy = entryLabels(lang)
  const [stage, setStage] = useState<EntryStage>(initialStage)
  const [current, setCurrent] = useState<EntryLevel | 'unknown'>('secondary')
  const [target, setTarget] = useState<EntryLevel>('dse')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [recommended, setRecommended] = useState<BookId>('a2')
  const [testQuestions] = useState(shuffledDiagnosticQuestions)

  function continueFromProfile() {
    if (current === 'unknown') { setStage('test'); return }
    setBookId(bookForEntry(target)); onDone()
  }
  function answer(value: number) {
    if (selected !== null) return
    setSelected(value)
    if (value === testQuestions[questionIndex].answer) setScore((previous) => previous + 1)
  }
  function nextQuestion() {
    if (selected === null) return
    if (questionIndex < testQuestions.length - 1) { setQuestionIndex((previous) => previous + 1); setSelected(null); return }
    const finalScore = score + (selected === testQuestions[questionIndex].answer ? 1 : 0)
    const nextBook = bookForScore(finalScore)
    setRecommended(nextBook); setStage('result')
  }
  const question = testQuestions[questionIndex]
  return <main className={`entry-quiz-shell page-enter entry-${stage}`}><button className="text-back" onClick={back}><ArrowLeft size={16} /> {copy.back}</button>
    {stage === 'profile' && <section className="entry-card"><div className="eyebrow">{copy.eyebrow}</div><h1>{copy.title}</h1><p className="entry-intro">{copy.body}</p><div className="entry-columns"><div><h2>{copy.current}</h2><p className="entry-hint">{copy.currentHint}</p><div className="entry-options">{(['secondary', 'dse', 'ielts'] as EntryLevel[]).map((level) => <button key={level} className={current === level ? 'selected' : ''} onClick={() => setCurrent(level)}><span>{level === 'secondary' ? '🎒' : level === 'dse' ? '🏫' : '🌍'}</span><strong>{copy[level]}</strong><small>{level === 'secondary' ? 'A2 · B1' : level === 'dse' ? 'HKDSE · B1–B2' : 'B2 · C1'}</small>{current === level && <Check size={18} />}</button>)}<button className={`entry-unknown ${current === 'unknown' ? 'selected' : ''}`} onClick={() => setCurrent('unknown')}><span>🧭</span><strong>{copy.notSure}</strong>{current === 'unknown' && <Check size={18} />}</button></div></div><div><h2>{copy.target}</h2><p className="entry-hint">{copy.targetHint}</p><div className="entry-targets">{(['secondary', 'dse', 'ielts'] as EntryLevel[]).map((level) => <button key={level} className={target === level ? 'selected' : ''} onClick={() => setTarget(level)}><span>{level === 'secondary' ? '📘' : level === 'dse' ? '🎓' : '✈️'}</span><strong>{copy[level]}</strong>{target === level && <Check size={18} />}</button>)}</div></div></div><button className="primary-button entry-continue" onClick={continueFromProfile}>{current === 'unknown' ? copy.testTitle : copy.continue} <ArrowRight size={18} /></button></section>}
    {stage === 'test' && <section className="entry-card diagnostic-card"><div className="diagnostic-top"><div><div className="eyebrow">{copy.testTitle}</div><h1>{copy.testBody}</h1></div><span className="diagnostic-score">{questionIndex + 1} / {testQuestions.length}</span></div><div className="diagnostic-track"><span style={{ width: `${(questionIndex + 1) / testQuestions.length * 100}%` }} /></div><div className="diagnostic-question"><span>{copy.question} {questionIndex + 1}</span><h2>{question.prompt}</h2></div><div className="diagnostic-options">{question.options.map((option, optionIndex) => <button key={option} className={`${selected === optionIndex ? optionIndex === question.answer ? 'correct' : 'wrong' : ''} ${selected !== null && optionIndex === question.answer ? 'correct' : ''}`} onClick={() => answer(optionIndex)} disabled={selected !== null}><b>{String.fromCharCode(65 + optionIndex)}</b>{option}{selected !== null && optionIndex === question.answer && <Check size={18} />}</button>)}</div>{selected !== null && <div className={`diagnostic-feedback ${selected === question.answer ? 'correct' : 'wrong'}`}>{selected === question.answer ? '✓' : '↺'} {selected === question.answer ? (lang === 'en' ? 'Nice! Keep going.' : lang === 'zh-HK' ? '答啱！繼續。' : '答对了！继续。') : (lang === 'en' ? 'That is okay. This is only a guide.' : lang === 'zh-HK' ? '唔緊要，呢個只係定位小測。' : '没关系，这只是定位小测。')}</div>}<button className="primary-button entry-continue" disabled={selected === null} onClick={nextQuestion}>{questionIndex === testQuestions.length - 1 ? copy.see : copy.next} <ArrowRight size={18} /></button></section>}
    {stage === 'result' && <section className="entry-card diagnostic-result"><div className="result-compass">🧭</div><div className="eyebrow">{copy.result}</div><h1>{books[recommended].title}</h1><p>{copy.resultBody}</p><div className="recommendation-level"><strong>{copy.score}: {score} / {testQuestions.length}</strong><span>{books[recommended].description}</span></div><button className="primary-button entry-continue" onClick={() => { setBookId(recommended); onDone() }}>{copy.use} <ArrowRight size={18} /></button><button className="ghost-button" onClick={onDone}>{copy.choose}</button></section>}
  </main>
}

export function SetupPage({ lang, bookId, setBookId, progress, back, openMap }: { lang: Lang; bookId: BookId; setBookId: (id: BookId) => void; progress: AppProgress; back: () => void; openMap: () => void }) {
  const t = translator(lang)
  const [entryDone, setEntryDone] = useState(false)
  const [entryStartStage, setEntryStartStage] = useState<EntryStage>('profile')
  if (!entryDone) return <EntryQuiz lang={lang} setBookId={setBookId} back={back} initialStage={entryStartStage} onDone={() => setEntryDone(true)} />
  return <main className="setup-shell page-enter"><button className="text-back" onClick={back}><ArrowLeft size={16} /> {t('backHome')}</button><div className="setup-toolbar"><button className="ghost-button setup-retake" onClick={() => { setEntryStartStage('test'); setEntryDone(false) }}>🧭 重新測試程度 / Change level</button></div>
    <div className="setup-heading"><div className="eyebrow">STORY MODE · YOUR ADVENTURE</div><h1>{t('setupTitle1')}<br /><em>{t('setupTitle2')}</em></h1><p>{t('setupBody')}</p></div>
    <div className="setup-section"><div className="setup-section-title"><span>01</span><div><h2>{t('chooseBook')}</h2><p>{t('bookBody')}</p></div></div><div className="book-grid v2-books">{ids.map((id) => <button className={`book-card ${bookId === id ? 'selected' : ''}`} key={id} onClick={() => setBookId(id)}><div className="book-top"><span className={`book-symbol book-${id}`}>{id === 'ielts' ? 'I' : id === 'cet6' ? '6' : id === 'hkdse' ? 'HK' : id.toUpperCase()}</span><span className="select-ring">{bookId === id && <Check size={14} />}</span></div><div className="book-type">{books[id].level} · {books[id].focus}</div><h3>{books[id].title}</h3><p>{bookDescription(id, lang) || books[id].description}</p><div className="book-foot"><span>{books[id].words.length} {t('sampleWords')}</span><span>{t('sampleBook')}</span></div></button>)}</div></div>
    <div className="setup-section"><div className="setup-section-title"><span>02</span><div><h2>{t('chooseGenre')}</h2><p>{t('genreBody')}</p></div></div><div className="genre-grid"><div className="genre-card selected"><span className="genre-art">✦</span><div><small>REVENGE STORY</small><h3>{t('revenge')}</h3><p>{t('revengeTitle')}</p></div><Check size={18} /></div><div className="genre-card disabled"><span className="genre-art">◈</span><div><small>CAMPUS MYSTERY · {t('comingSoon')}</small><h3>{t('mystery')}</h3></div><LockKeyhole size={18} /></div></div></div>
    <div className="setup-launch"><div><strong>{progress.books[bookId].completed.length ? t('welcomeBack') : t('ready')}</strong><span>{books[bookId].title} · {progress.books[bookId].completed.length} {t('chaptersDone')}</span></div><button className="primary-button" onClick={openMap}>{t('openMap')} <ArrowRight size={18} /></button></div>
  </main>
}

const mapPositions = [
  { left: '10%', top: '68%' },
  { left: '28%', top: '46%' },
  { left: '20%', top: '17%' },
  { left: '51%', top: '19%' },
  { left: '69%', top: '44%' },
  { left: '86%', top: '72%' },
]

const mapLandmarks = ['⚓', '🌴', '⛰', '🌊', '🦜', '🏝']

export function StoryMap({ lang, bookId, progress, onSetup, onChapter, onQuiz }: { lang: Lang; bookId: BookId; progress: BookProgress; onSetup: () => void; onChapter: (index: number, replay?: boolean) => void; onQuiz: (index: number) => void }) {
  const t = translator(lang)
  const chapters = getChapters(bookId).map((chapter, index) => localizeChapter(chapter, index, lang, books[bookId]))
  const [selected, setSelected] = useState(Math.min(progress.unlocked, chapters.length - 1))
  const chapter = chapters[selected]
  const locked = selected > progress.unlocked
  const completed = progress.completed.includes(selected)
  const completion = Math.round(progress.completed.length / chapters.length * 100)
  const routeCompletion = Math.min(100, progress.completed.length / Math.max(chapters.length - 1, 1) * 100)
  return <main className="story-map page-enter">
    <div className="map-header"><button className="text-back" onClick={onSetup}><ArrowLeft size={16} /> {t('chooseBook')}</button><span className="map-book-pill"><span>✦</span> {books[bookId].title} · {t('sampleBook')}</span></div>
    <section className="map-hero">
      <div className="map-hero-copy"><div className="eyebrow">ADVENTURE MAP · STORY MODE</div><h1>{t('mapTitle')}</h1><p>{t('mapBody')}</p><div className="map-progress-label"><span>{t('storyComplete')}</span><strong>{completion}%</strong></div><div className="map-progress-track"><span style={{ width: `${completion}%` }} /></div><button className="primary-button map-hero-button" onClick={() => onChapter(progress.unlocked)}>{t('latestChapter')} <ArrowRight size={17} /></button></div>
      <div className="map-hero-art" aria-hidden="true"><span className="map-sun" /><span className="map-island island-one" /><span className="map-island island-two" /><span className="map-sail">⛵</span><span className="map-hero-compass">✧</span></div>
    </section>
    <div className="map-section-title"><div><div className="eyebrow">FOLLOW THE TRAIL</div><h2>{t('storyMap')}</h2></div><div className="map-key"><span><i className="key-dot current" /> {t('available')}</span><span><i className="key-dot done" /> {t('completed')}</span><span><i className="key-dot locked" /> {t('locked')}</span></div></div>
    <section className="map-board" aria-label={t('storyMap')}>
      <div className="map-paper-speckles" aria-hidden="true" /><span className="map-label map-label-start">START</span><span className="map-label map-label-finish">FINISH</span><span className="map-decoration map-decoration-left">🌴</span><span className="map-decoration map-decoration-right">⛰</span>
      <svg className="map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="route-shadow" pathLength="100" d="M 10 68 C 16 62, 20 55, 28 46 C 35 37, 15 25, 20 17 C 25 10, 41 21, 51 19 C 59 17, 62 35, 69 44 C 76 53, 77 65, 86 72" /><path className="route-base" pathLength="100" d="M 10 68 C 16 62, 20 55, 28 46 C 35 37, 15 25, 20 17 C 25 10, 41 21, 51 19 C 59 17, 62 35, 69 44 C 76 53, 77 65, 86 72" /><path className="route-progress" pathLength="100" strokeDasharray={`${routeCompletion} 100`} d="M 10 68 C 16 62, 20 55, 28 46 C 35 37, 15 25, 20 17 C 25 10, 41 21, 51 19 C 59 17, 62 35, 69 44 C 76 53, 77 65, 86 72" /></svg>
      <div className="map-levels">{chapters.map((item, index) => {
        const state = progress.completed.includes(index) ? 'done' : index > progress.unlocked ? 'locked' : index === progress.chapter ? 'current' : 'ready'
        return <button key={index} className={`map-node ${state} ${selected === index ? 'selected' : ''}`} style={mapPositions[index]} onClick={() => setSelected(index)} aria-label={`${t('chapter')} ${index + 1}: ${item.title}`}><span className="node-pin" /><span className="node-landmark">{mapLandmarks[index]}</span><span className="node-chest"><i className="chest-lid" /><i className="chest-body" /><i className="chest-lock">{state === 'locked' ? <LockKeyhole size={12} /> : state === 'done' ? <Check size={13} /> : <Compass size={12} />}</i><i className="chest-shine">✦</i></span><span className="node-number">0{index + 1}</span><span className="node-status">{state === 'done' ? t('completed') : state === 'locked' ? t('locked') : state === 'current' ? t('inProgress') : t('available')}</span><strong>{item.title}</strong></button>
      })}</div>
    </section>
    <div className={`map-detail ${locked ? 'is-locked' : ''}`}><div className="map-detail-symbol">{locked ? <LockKeyhole size={27} /> : chapter.icon}</div><div className="map-detail-copy"><div className="eyebrow">CHAPTER 0{selected + 1} · {completed ? t('completed') : locked ? t('locked') : t('available')}</div><h2>{chapter.title}</h2><p>{locked ? t('unlockRule') : chapter.teaser}</p>{completed && <div className="chapter-word-list">{chapter.quizWords.map((word) => { const data = books[bookId].words.find((item) => item.word === word)!; return <span key={word}>{word}<small>{wordMeaning(data, lang)}</small></span> })}</div>}</div><div className="map-detail-actions">{!locked && <><button className="primary-button" onClick={() => onChapter(selected, completed)}>{completed ? t('replay') : t('openChapter')} <ChevronRight size={17} /></button>{completed && <button className="ghost-button" onClick={() => onQuiz(selected)}>{t('takeQuiz')}</button>}</>}</div></div>
  </main>
}

export function ProgressPage({ lang, booksProgress, notesXp, selectedBook, onMap, reset }: { lang: Lang; booksProgress: AppProgress['books']; notesXp: number; selectedBook: BookId; onMap: () => void; reset: () => void }) {
  const t = translator(lang)
  const [confirm, setConfirm] = useState(false)
  const all = Object.values(booksProgress)
  const xp = all.reduce((sum, item) => sum + item.xp, notesXp)
  const learned = new Set(all.flatMap((item) => item.learned)).size
  const mastered = new Set(all.flatMap((item) => item.mastered)).size
  const missed = [...new Set(all.flatMap((item) => item.missed))]
  return <main className="progress-shell page-enter"><div className="eyebrow">YOUR JOURNEY · LEARNING ARCHIVE</div><div className="progress-heading"><div><h1>{t('archiveTitle1')}<em>{t('archiveTitle2')}</em></h1><p>{t('archiveBody')}</p></div><span className="rank-badge"><Trophy size={20} /> LEVEL {Math.floor(xp / 200) + 1}</span></div><div className="stat-grid"><div><Sparkles size={23} /><strong>{xp}</strong><span>{t('totalXp')}</span></div><div><BookOpen size={23} /><strong>{learned}</strong><span>{t('learned')}</span></div><div><Check size={23} /><strong>{mastered}</strong><span>{t('mastered')}</span></div><div><Compass size={23} /><strong>{all.reduce((sum, item) => sum + item.completed.length, 0)}</strong><span>{t('chaptersDone')}</span></div></div>
    <div className="archive-grid"><section className="archive-panel"><div className="panel-heading"><div><div className="eyebrow">STORY PROGRESS</div><h2>{t('storyProgress')}</h2></div><button onClick={onMap}>{t('continueLearning')} <ArrowRight size={16} /></button></div>{ids.map((id) => <div className="archive-book" key={id}><div><span className="archive-book-icon">{id === 'ielts' ? 'I' : id === 'hkdse' ? 'HK' : id.toUpperCase()}</span><div><strong>{books[id].title}</strong><small>{booksProgress[id].completed.length} / {getChapters(id).length} {t('chaptersDone')}</small></div></div><div className="archive-track"><span style={{ width: `${booksProgress[id].completed.length / getChapters(id).length * 100}%` }} /></div></div>)}</section><section className="archive-panel"><div className="panel-heading"><div><div className="eyebrow">REVIEW LIST</div><h2>{t('reviewList')}</h2></div><span className="review-count">{missed.length}</span></div>{missed.length ? <div className="missed-list">{missed.map((word) => <span key={word}>{word}</span>)}</div> : <div className="empty-state"><Check size={24} /><p>{t('noReview')}</p></div>}</section></div>
    <div className="reset-row"><span>{t('restartHint')} {books[selectedBook].title}</span>{confirm ? <div className="reset-confirm"><strong>{t('resetTitle')}</strong><small>{t('resetBody')}</small><button onClick={() => setConfirm(false)}>{t('cancel')}</button><button onClick={() => { reset(); setConfirm(false) }}>{t('confirmReset')}</button></div> : <button onClick={() => setConfirm(true)}><RotateCcw size={16} /> {t('restart')}</button>}</div>
  </main>
}
