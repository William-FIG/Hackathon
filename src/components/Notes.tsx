import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, Gamepad2, RotateCcw, Sparkles, Upload, Volume2, X } from 'lucide-react'
import { playCue, speakWord } from '../audio'
import { translator } from '../i18n'
import { parseNotes, sampleNotes } from '../logic'
import { extractPdfText } from '../pdf'
import type { Concept, Lang } from '../types'

type Stage = 'input' | 'select' | 'learn' | 'match' | 'story' | 'boss' | 'result'
type Feedback = 'correct' | 'wrong' | null

const MAX_GAME_WORDS = 8
const emojiFor = (term: string, index: number, definition = '') => {
  const value = `${term} ${definition}`.toLowerCase()
  if (/primary\s*key|unique(?:ly)? identifies|unique id/.test(value)) return '🔑'
  if (/foreign\s*key|references? a key|links? to another/.test(value)) return '🔗'
  if (/inner\s*join|matching values|combine rows/.test(value)) return '🧩'
  if (/database|data base|server|storage/.test(value)) return '🗄️'
  if (/table|spreadsheet|columns?|rows?/.test(value)) return '📊'
  if (/record|entry|field/.test(value)) return '🧾'
  if (/pollut|smog|air|carbon|climate/.test(value)) return '🏭'
  if (/recycl|reuse|waste|trash|plastic/.test(value)) return '♻️'
  if (/water|river|ocean|rain/.test(value)) return '💧'
  if (/plant|tree|forest|flower/.test(value)) return '🌱'
  if (/animal|bird|fish|cat|dog/.test(value)) return '🐾'
  if (/energy|power|electric|solar/.test(value)) return '⚡'
  if (/school|learn|study|class/.test(value)) return '📚'
  if (/friend|team|help|share/.test(value)) return '🤝'
  return ['🧙', '🦊', '🌟', '🪄', '🛡️', '🚀', '🗺️', '🏆'][index % 8]
}

function speakConcept(term: string, audioOn: boolean) {
  if (audioOn) speakWord(term)
}

export function NotesGame({ lang, onHome, onXp, audioOn }: { lang: Lang; onHome: () => void; onXp: (xp: number) => void; audioOn: boolean }) {
  const t = translator(lang)
  const [stage, setStage] = useState<Stage>('input')
  const [text, setText] = useState('')
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [chosenTerm, setChosenTerm] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [bossScore, setBossScore] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [earned, setEarned] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const playable = concepts.slice(0, MAX_GAME_WORDS)
  const concept = playable[index]
  const definitions = [...playable.slice(1), ...playable.slice(0, 1)]
  const storyOptions = concept ? [concept.definition, ...playable.filter((item) => item.term !== concept.term).slice(0, 3).map((item) => item.definition)].map((_, optionIndex, all) => all[(optionIndex + index) % all.length]) : []
  const bossOptions = concept ? [concept.term, ...playable.filter((item) => item.term !== concept.term).slice(0, 3).map((item) => item.term)].map((_, optionIndex, all) => all[(optionIndex + index) % all.length]) : []

  async function upload(file?: File) {
    if (!file) return
    setError(''); setStatus('')
    if (!/\.(pdf|txt|md)$/i.test(file.name)) { setError(t('invalidFile')); return }
    if (file.size > 8 * 1024 * 1024) { setError(t('tooLarge')); return }
    setFileName(file.name)
    try {
      setStatus(t('scanning'))
      const extracted = /\.pdf$/i.test(file.name) ? await extractPdfText(file) : await file.text()
      if (!extracted.trim()) { setText(''); setError(t('scannedPdf')); setStatus(''); return }
      setText(extracted); setStatus(`${file.name} · ${extracted.length} ${t('chars')}`)
    } catch { setError(/\.pdf$/i.test(file.name) ? t('scanPdfError') : t('readError')); setStatus('') }
  }

  function generate() {
    const parsed = parseNotes(text)
    if (parsed.length < 3) { setError(t('invalidNotes')); return }
    setConcepts(parsed); setError(''); setStage('select')
  }

  function startGame(nextStage: Stage = 'learn') {
    setIndex(0); setSelected(null); setChosenTerm(null); setMatched([]); setBossScore(0); setFeedback(null); setEarned(0); setStage(nextStage)
  }

  function award(points: number, cue: 'correct' | 'reward' = 'correct') {
    setEarned((previous) => previous + points)
    onXp(points)
    playCue(cue, audioOn)
  }

  function collectWord() {
    award(10)
    if (index + 1 < playable.length) setIndex((previous) => previous + 1)
    else { setIndex(0); setFeedback(null); setStage('match') }
  }

  function chooseTerm(term: string) {
    if (matched.includes(term)) return
    setChosenTerm(term); setFeedback(null)
  }

  function matchDefinition(item: Concept) {
    if (!chosenTerm || matched.includes(item.term)) return
    if (chosenTerm === item.term) {
      const next = [...matched, chosenTerm]
      setMatched(next); setChosenTerm(null); setFeedback('correct'); award(10)
      if (next.length === playable.length) window.setTimeout(() => { setIndex(0); setFeedback(null); setStage('story') }, 600)
    } else {
      setFeedback('wrong'); playCue('wrong', audioOn)
    }
  }

  function answerStory(option: string) {
    if (!concept || selected === concept.definition) return
    setSelected(option)
    const right = option === concept.definition
    if (right) award(10)
    else playCue('wrong', audioOn)
    setFeedback(right ? 'correct' : 'wrong')
  }

  function nextStory() {
    if (!concept || selected !== concept.definition) return
    if (index + 1 < playable.length) { setIndex((previous) => previous + 1); setSelected(null); setFeedback(null) }
    else { setIndex(0); setSelected(null); setFeedback(null); setStage('boss') }
  }

  function answerBoss(option: string) {
    if (!concept || selected === concept.term) return
    const right = option === concept.term
    setSelected(option); setFeedback(right ? 'correct' : 'wrong')
    if (right) { setBossScore((previous) => previous + 1); award(20) } else playCue('wrong', audioOn)
  }

  function nextBoss() {
    if (!concept || selected !== concept.term) return
    if (index + 1 < playable.length) { setIndex((previous) => previous + 1); setSelected(null); setFeedback(null) }
    else { setStage('result'); playCue('reward', audioOn) }
  }

  const readInput = <div className="notes-editor"><div className="editor-top"><span><FileText size={18} /> {t('studyMaterial')}</span><span>PDF / TXT / MD</span></div><div className={`drop-zone ${dragging ? 'dragging' : ''}`} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') fileRef.current?.click() }} onClick={() => fileRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files[0]) }}><Upload size={23} /><strong>{t('dropFile')}</strong><small>{t('upload')} · ≤ 8 MB</small></div><input ref={fileRef} className="hidden" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = '' }} />{fileName && <div className="file-pill">{fileName}<button aria-label={t('removeFile')} onClick={() => { setFileName(''); setText(''); setStatus(''); setError('') }}><X size={13} /></button></div>}{status && <div className="processing-status">{status}</div>}<label className="preview-label" htmlFor="notes-content">{t('preview')}</label><textarea id="notes-content" aria-label={t('studyMaterial')} value={text} onChange={(event) => { setText(event.target.value); setError('') }} placeholder={'Primary Key: A field that uniquely identifies each record.\nForeign Key: A field that references a key in another table.\nINNER JOIN: Returns rows with matching values in both tables.'} /><div className="editor-foot"><span>{text.length} {t('chars')} · {parseNotes(text).length} {t('conceptsFound')}</span><button onClick={() => fileRef.current?.click()}><Upload size={16} /> {t('upload')}</button></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="editor-actions"><button className="ghost-button" onClick={() => { setText(sampleNotes); setFileName(''); setError(''); setStatus('') }}>{t('sample')}</button><button className="primary-button" onClick={generate}>{t('createGame')} <ArrowRight size={17} /></button></div></div>

  const levelCard = (number: number, icon: string, title: string, body: string, onClick: () => void, locked = false) => <button type="button" className={`notes-level-card ${locked ? 'locked' : 'ready'}`} onClick={onClick} disabled={locked}><span className="level-icon">{icon}</span><span className="level-copy"><small>LEVEL 0{number}</small><strong>{title}</strong><span>{body}</span></span>{locked ? <span className="level-lock">🔒</span> : <span className="level-check">✓ PLAY</span>}</button>

  return <main className={`notes-shell page-enter notes-stage-${stage}`}><div className="notes-nav"><button className="text-back" onClick={onHome}><ArrowLeft size={16} /> {t('backHome')}</button>{stage !== 'input' && stage !== 'select' && <button className="text-back" onClick={() => setStage('select')}>{t('chooseAnother')} <ArrowRight size={16} /></button>}</div>
    {stage === 'input' && <div className="notes-grid"><div className="notes-copy"><div className="notes-mascot"><span>🧙</span><i>✦</i></div><div className="eyebrow">NOTES TO GAME · 01 / 04</div><h1>{t('notesTitle1')}<br /><em>{t('notesTitle2')}</em></h1><p>{t('notesBody')}</p><div className="notes-points"><div><span>01</span> {t('notesStep1')}</div><div><span>02</span> {t('notesStep2')}</div><div><span>03</span> {t('notesStep3')}</div></div><div className="parser-note"><Sparkles size={17} /> {t('ruleNotice')}</div></div>{readInput}</div>}
    {stage === 'select' && <div className="notes-mission-board"><div className="eyebrow">YOUR LEARNING QUEST · 02 / 04</div><h1>召集你嘅字靈隊伍</h1><p>每次只玩 {playable.length} 個生字。四關、短句、即時獎勵，慢慢升級就得。</p><div className="concept-preview">{playable.length} 個字靈 · {playable.slice(0, 5).map((item) => item.term).join(' · ')}</div><div className="notes-level-grid">{levelCard(1, '🧙', '認識字靈', '睇圖、聽音、收集生字', () => startGame('learn'))}{levelCard(2, '🧩', '配對挑戰', '圖片配英文，答錯再試', () => startGame('match'))}{levelCard(3, '📖', '故事選擇', '短故事，揀啱意思', () => startGame('story'))}{levelCard(4, '🐉', 'Boss 戰', '答啱就打怪獸，唔會死', () => startGame('boss'))}</div><button className="primary-button mission-start" onClick={() => startGame()}>開始第一關 <ArrowRight size={18} /></button><button className="text-back" onClick={() => setStage('input')}><ArrowLeft size={16} /> {t('editNotes')}</button></div>}
    {stage === 'learn' && concept && <div className="sen-game-shell"><div className="level-progress"><span>第 1 關 · 認識字靈</span><strong>{index + 1} / {playable.length}</strong></div><div className="level-track"><span style={{ width: `${(index + 1) / playable.length * 100}%` }} /></div><div className="sen-game-heading"><div><div className="eyebrow">WORD SPIRIT CAMP</div><h1>收集 {concept.term}</h1><p>睇圖 · 聽音 · 記住佢</p></div><div className="coin-counter">🪙 {earned}</div></div><div className="word-spirit-card"><div className="spirit-picture">{emojiFor(concept.term, index, concept.definition)}</div><div className="spirit-word">{concept.term}<button className="audio-word-button" aria-label={`聽 ${concept.term}`} onClick={() => speakConcept(concept.term, audioOn)}><Volume2 size={20} /></button></div><div className="spirit-meaning">{concept.definition}</div><div className="spirit-helper">按喇叭聽發音，再按下面加入隊伍</div><button className="primary-button collect-button" onClick={collectWord}>加入字靈隊伍 <span>+10 🪙</span></button></div></div>}
    {stage === 'match' && <div className="sen-game-shell"><div className="level-progress"><span>第 2 關 · 配對挑戰</span><strong>{matched.length} / {playable.length}</strong></div><div className="level-track"><span style={{ width: `${matched.length / playable.length * 100}%` }} /></div><div className="sen-game-heading"><div><div className="eyebrow">PICTURE MATCH</div><h1>幫字靈搵朋友</h1><p>先撳圖片，再撳英文生字。答錯唔扣分。</p></div><div className="coin-counter">🪙 {earned}</div></div><div className="picture-match-board"><div className="match-spirit-column">{playable.map((item, itemIndex) => <button key={item.term} className={`spirit-match-card ${chosenTerm === item.term ? 'picked' : ''} ${matched.includes(item.term) ? 'matched' : ''}`} disabled={matched.includes(item.term)} onClick={() => chooseTerm(item.term)}><span>{emojiFor(item.term, itemIndex, item.definition)}</span><small>{matched.includes(item.term) ? '配對成功！' : '揀我'}</small></button>)}</div><div className="match-word-column">{definitions.map((item) => <button key={item.term} className={`word-match-card ${matched.includes(item.term) ? 'matched' : ''}`} disabled={matched.includes(item.term)} onClick={() => matchDefinition(item)}><strong>{item.term}</strong><small>English word</small>{matched.includes(item.term) && <Check size={18} />}</button>)}</div></div>{feedback === 'wrong' && <div className="sen-feedback wrong">再試一次！唔扣分 💪</div>}{feedback === 'correct' && <div className="sen-feedback correct">配對成功！+10 金幣 ✨</div>}</div>}
    {stage === 'story' && concept && <div className="sen-game-shell story-level-shell"><div className="level-progress"><span>第 3 關 · 故事選擇</span><strong>{index + 1} / {playable.length}</strong></div><div className="level-track"><span style={{ width: `${(index + 1) / playable.length * 100}%` }} /></div><div className="sen-game-heading"><div><div className="eyebrow">TINY STORY TRAIL</div><h1>幫小隊作選擇</h1><p>短句、慢慢諗，答錯可以再試。</p></div><div className="coin-counter">🪙 {earned}</div></div><div className="story-card-sen"><div className="story-scene-emoji">{emojiFor(concept.term, index, concept.definition)} 🧙‍♀️ 🗺️</div><p>小隊行到森林。<br />佢哋見到「{concept.term}」。<br />邊個意思啱？</p><div className="story-choices">{storyOptions.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} disabled={selected === concept.definition} className={selected === option ? option === concept.definition ? 'right' : 'wrong' : ''} onClick={() => answerStory(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{selected === option && (option === concept.definition ? <Check size={18} /> : <X size={18} />)}</button>)}</div>{feedback === 'wrong' && <div className="sen-feedback wrong">差少少！睇清楚再試 💪</div>}{feedback === 'correct' && <div className="sen-feedback correct">答啱！+10 金幣 ✨</div>}{selected === concept.definition && <button className="primary-button next-level-button" onClick={nextStory}>繼續故事 <ArrowRight size={18} /></button>}</div></div>}
    {stage === 'boss' && concept && <div className="sen-game-shell boss-level-shell"><div className="level-progress"><span>第 4 關 · Boss 戰</span><strong>{index + 1} / {playable.length}</strong></div><div className="level-track"><span style={{ width: `${(index + 1) / playable.length * 100}%` }} /></div><div className="sen-game-heading"><div><div className="eyebrow">WORD DRAGON BOSS</div><h1>打敗字詞怪獸！</h1><p>答啱就攻擊。答錯怪獸唔會傷害你。</p></div><div className="coin-counter">🪙 {earned}</div></div><div className="boss-arena"><div className="boss-monster">🐉<span>{bossScore} HIT</span></div><div className="boss-question"><div className="question-scroll">「{concept.definition}」係邊個字？</div><div className="boss-options">{bossOptions.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} disabled={selected === concept.term} className={selected === option ? option === concept.term ? 'right' : 'wrong' : ''} onClick={() => answerBoss(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{selected === option && (option === concept.term ? <Check size={18} /> : <X size={18} />)}</button>)}</div>{feedback === 'wrong' && <div className="sen-feedback wrong">怪獸笑咗，但你可以無限再試！</div>}{feedback === 'correct' && <div className="sen-feedback correct">砰！命中！+20 XP ⚔️</div>}{selected !== null && <button className="primary-button next-level-button" onClick={nextBoss}>{index + 1 === playable.length ? '完成 Boss 戰' : '下一擊'} <ArrowRight size={18} /></button>}</div></div></div>}
    {stage === 'result' && <div className="sen-result-card"><div className="result-trophy">🏆</div><div className="eyebrow">QUEST COMPLETE · 04 / 04</div><h1>你打敗字詞怪獸！</h1><p>{bossScore} / {playable.length} 題答啱 · 你今次收集咗 {earned} 金幣</p><div className="result-rewards"><span>🪙 {earned} 金幣</span><span>⭐ +{earned} XP</span><span>💪 可以再試</span></div><div className="result-actions"><button className="primary-button" onClick={() => startGame()}><RotateCcw size={17} /> 再玩一次</button><button className="ghost-button" onClick={() => setStage('select')}><Gamepad2 size={17} /> 換一個任務</button><button className="ghost-button" onClick={() => setStage('input')}>{t('editNotes')}</button></div></div>}
  </main>
}
