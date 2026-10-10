import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Check, CirclePlay, Flame, Menu, ScrollText, Sparkles, X } from 'lucide-react'
import { freshProgress, loadProgress, saveProgress } from './logic'
import { chromeCopy, translator } from './i18n'
import type { AppProgress, BookId, BookProgress, Lang, Page } from './types'
import { ChapterChallenge, StoryReader } from './components/Story'
import { NotesGame } from './components/Notes'
import { SetupPage, StoryMap, ProgressPage } from './components/Pages'
import { ReviewPage } from './features/virtual-character/ReviewPage'
import { reviewNavLabel } from './features/virtual-character/reviewData'

function savedLang(): Lang { try { const value = localStorage.getItem('plottwist-lang'); return value === 'en' || value === 'zh-HK' ? value : 'zh-CN' } catch { return 'zh-CN' } }
function savedAudio(): boolean { try { return localStorage.getItem('plottwist-audio') !== 'off' } catch { return true } }
function savedSpeed(): number { try { const value = Number(localStorage.getItem('plottwist-speed')); return [0.75, 1, 1.25].includes(value) ? value : 1 } catch { return 1 } }

function App() {
  const [page, setPage] = useState<Page>('home')
  const [progress, setProgress] = useState<AppProgress>(loadProgress)
  const [bookId, setBookId] = useState<BookId>('ielts')
  const [lang, setLang] = useState<Lang>(savedLang)
  const [audioOn, setAudioOn] = useState(savedAudio)
  const [speed, setSpeed] = useState(savedSpeed)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = translator(lang)
  const copy = chromeCopy(lang)
  const current = progress.books[bookId]
  const allProgress = Object.values(progress.books)
  const totalXp = allProgress.reduce((sum, item) => sum + item.xp, progress.notesXp)
  const learned = new Set(allProgress.flatMap((item) => item.learned)).size
  const mastered = new Set(allProgress.flatMap((item) => item.mastered)).size

  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => { try { localStorage.setItem('plottwist-lang', lang) } catch { /* Storage optional. */ }; document.documentElement.lang = lang }, [lang])
  useEffect(() => { try { localStorage.setItem('plottwist-audio', audioOn ? 'on' : 'off'); localStorage.setItem('plottwist-speed', String(speed)) } catch { /* Storage optional. */ } }, [audioOn, speed])

  function updateBook(next: BookProgress) {
    const positions = [...(next.positions || Array(6).fill(0))]
    positions[next.chapter] = next.segment
    setProgress((previous) => ({ ...previous, books: { ...previous.books, [bookId]: { ...next, positions } } }))
  }
  function navigate(next: Page) { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function openChapter(index: number, replay = false) {
    if (index > current.unlocked) return
    const positions = [...(current.positions || [])]
    positions[current.chapter] = current.segment
    updateBook({ ...current, chapter: index, segment: replay ? 0 : (positions[index] || 0), positions })
    navigate('reader')
  }
  function resetStory() { setProgress((previous) => ({ ...previous, books: { ...previous.books, [bookId]: freshProgress().books[bookId] } })); navigate('map') }

  return <div className="app-shell">
    <header className="site-header"><div className="header-inner">
      <button className="brand" onClick={() => navigate('home')} aria-label="PlotTwist"><span className="brand-icon">✦</span><span>Plot<span className="brand-accent">Twist</span><small>{copy.brandTagline}</small></span></button>
      <nav className={menuOpen ? 'open' : ''}><button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>{t('home')}</button><button className={['setup','map','reader','challenge'].includes(page) ? 'active' : ''} onClick={() => navigate('setup')}>{t('storyMode')}</button><button className={page === 'review' ? 'active' : ''} onClick={() => navigate('review')}>{reviewNavLabel(lang)}</button><button className={page === 'notes' ? 'active' : ''} onClick={() => navigate('notes')}>{t('notesGame')}</button><button className={page === 'progress' ? 'active' : ''} onClick={() => navigate('progress')}>{t('progress')}</button></nav>
      <div className="header-actions"><select aria-label="Language" className="language-select" value={lang} onChange={(event) => setLang(event.target.value as Lang)}><option value="zh-CN">简体中文</option><option value="zh-HK">廣東話</option><option value="en">English</option></select><button className="xp-pill" onClick={() => navigate('progress')}><Sparkles size={15} /> {totalXp} XP</button><button className="mobile-menu" aria-label={copy.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
    </div></header>

    {page === 'home' && <main className="home page-enter"><section className="hero"><div className="hero-glow" /><div className="hero-inner"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot" /> {copy.heroKicker}</div><h1>{t('heroTitle1')}<br /><em>{t('heroTitle2')}</em></h1><p>{t('heroBody')}</p><div className="hero-actions"><button className="primary-button" onClick={() => navigate('setup')}>{t('startStory')} <ArrowRight size={18} /></button><button className="hero-secondary" onClick={() => navigate('notes')}><CirclePlay size={19} /> {t('notesEntry')}</button></div><div className="hero-proof"><div className="tiny-avatars"><span>林</span><span>栀</span><span>✦</span></div><span>{t('originalStory')}</span><i /><span>{t('learningDrives')}</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-halo" /><div className="art-window"><div className="window-top"><span>PRIVATE FILE · 00:17 AM</span><span>● ● ●</span></div><div className="window-title">THE EVIDENCE<br />WAS <em>FABRICATED.</em></div><div className="window-scan">ACCESS DENIED <span>→</span> TRUTH UNLOCKED</div><div className="window-bars"><span /><span /><span /><span /><span /></div></div><div className="floating-card card-one"><span>✦</span><div><small>{t('nextUnlocked')}</small><strong>{copy.chapterNumber.replace('{number}', '2')}</strong></div></div><div className="floating-card card-two"><span>+100</span><small>{copy.xpEarned}</small></div><div className="orbit-text">PLOT • TWIST • LEARN • REPEAT</div></div></div></section>
      <section className="home-content"><div className="section-heading"><div><div className="eyebrow">{copy.choosePathEyebrow}</div><h2>{t('choosePath')}</h2></div><p>{t('pathBody')}</p></div><div className="mode-grid"><button className="mode-card story-mode" onClick={() => navigate('setup')}><div className="mode-top"><span className="mode-icon purple"><BookOpen size={25} /></span><span className="mode-index">01 / 02</span></div><div className="mode-visual story-visual"><div className="visual-moon" /><div className="visual-building" /><div className="visual-figure" /><div className="visual-spark">✦</div></div><div className="mode-bottom"><span className="mode-label">{copy.interactiveFiction}</span><h3>{t('storyMode')}</h3><p>{t('storyCardBody')}</p><span className="mode-link">{t('enterStory')} <ArrowRight size={17} /></span></div></button><button className="mode-card notes-mode" onClick={() => navigate('notes')}><div className="mode-top"><span className="mode-icon orange"><ScrollText size={25} /></span><span className="mode-index">02 / 02</span></div><div className="mode-visual notes-visual"><div className="paper paper-back"><span /><span /><span /></div><div className="paper paper-front"><span /><span /><span /><span /></div><div className="paper-seal">?</div></div><div className="mode-bottom"><span className="mode-label">{copy.notesReimagined}</span><h3>{t('notesGame')}</h3><p>{t('notesCardBody')}</p><span className="mode-link">{t('enterNotes')} <ArrowRight size={17} /></span></div></button></div><div className="dashboard-strip"><div><span className="dash-icon"><Flame size={19} /></span><div><strong>{totalXp}</strong><small>{t('totalXp')}</small></div></div><div><span className="dash-icon"><BookOpen size={19} /></span><div><strong>{learned}</strong><small>{t('learned')}</small></div></div><div><span className="dash-icon"><Check size={19} /></span><div><strong>{mastered}</strong><small>{t('mastered')}</small></div></div><button onClick={() => navigate('progress')}>{t('viewProgress')} <ArrowRight size={17} /></button></div></section></main>}
    {page === 'setup' && <SetupPage lang={lang} bookId={bookId} setBookId={setBookId} progress={progress} back={() => navigate('home')} openMap={() => navigate('map')} />}
    {page === 'map' && <StoryMap lang={lang} bookId={bookId} progress={current} onSetup={() => navigate('setup')} onChapter={openChapter} onQuiz={(index) => { if (index > current.unlocked) return; updateBook({ ...current, chapter: index, segment: current.positions?.[index] || 0 }); navigate('challenge') }} />}
    {page === 'reader' && <StoryReader key={`${bookId}-${current.chapter}-${current.segment}-${lang}`} bookId={bookId} lang={lang} progress={current} update={updateBook} home={() => navigate('home')} map={() => navigate('map')} challenge={() => navigate('challenge')} openChapter={openChapter} audioOn={audioOn} setAudioOn={setAudioOn} speed={speed} setSpeed={setSpeed} />}
    {page === 'challenge' && <ChapterChallenge key={`${bookId}-${current.chapter}-${lang}`} bookId={bookId} lang={lang} progress={current} update={updateBook} reader={() => navigate('reader')} map={() => navigate('map')} home={() => navigate('home')} nextChapter={() => openChapter(current.chapter + 1)} audioOn={audioOn} />}
    {page === 'review' && <ReviewPage bookId={bookId} progress={current} lang={lang} />}
    {page === 'notes' && <NotesGame lang={lang} onHome={() => navigate('home')} onXp={(xp) => setProgress((previous) => ({ ...previous, notesXp: previous.notesXp + xp }))} audioOn={audioOn} />}
    {page === 'progress' && <ProgressPage lang={lang} booksProgress={progress.books} notesXp={progress.notesXp} selectedBook={bookId} onMap={() => navigate('map')} reset={resetStory} />}
    <footer className="site-footer"><span>✦ PlotTwist <small>{copy.brandTagline}</small></span><span>{t('footer')}</span></footer>
  </div>
}

export default App
