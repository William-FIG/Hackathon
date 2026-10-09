import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const vite = await createServer({ server: { host: '127.0.0.1', port: 0 } })
await vite.listen()
const port = vite.httpServer.address().port
const url = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_BROWSER_EXECUTABLE || (existsSync(edge) ? edge : undefined), headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))

try {
  await mkdir('artifacts', { recursive: true })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /开启你的故事/ }).click()
  await page.getByRole('button', { name: /IELTS Vocabulary/ }).click()
  await page.getByRole('button', { name: /打开章节地图/ }).click()
  assert.equal(await page.locator('.map-node').count(), 6)
  await page.locator('.map-node').nth(1).click()
  assert.equal(await page.getByText('上一章挑战达到 80% 即可解锁').count(), 1)
  await page.locator('.map-node').first().click()
  await page.getByRole('button', { name: /进入章节/ }).click()
  await page.screenshot({ path: 'artifacts/v2-reader.png', fullPage: true })
  await page.getByRole('button', { name: /朗读本段/ }).click()
  assert.equal(await page.getByRole('button', { name: /暂停朗读|继续朗读/ }).count(), 1)
  await page.getByRole('button', { name: /暂停朗读|继续朗读/ }).click()
  for (const [word, next] of [['fabricated', '继续剧情'], ['discrepancy', '继续剧情']]) {
    await page.locator('.answer-option').filter({ hasText: word }).click()
    await page.getByRole('button', { name: next }).click()
  }
  await page.locator('.answer-option').filter({ hasText: 'discrepancy' }).click()
  assert.equal(await page.getByText('剧情转向 · 陷阱').count(), 1)
  await page.locator('.answer-option').filter({ hasText: 'corroborate' }).click()
  assert.equal(await page.getByText(/补救行动/).count(), 1)
  await page.getByRole('button', { name: /进入章节挑战/ }).click()
  for (const answer of ['伪造的', 'discrepancy', '证实；佐证', 'covert', '显示有罪的']) {
    await page.locator('.quiz-options button').filter({ hasText: answer }).click()
    await page.getByRole('button', { name: answer === '显示有罪的' ? '查看挑战结果' : '下一题' }).click()
  }
  assert.equal(await page.getByText('下一章，已解锁。').count(), 1)
  await page.getByRole('button', { name: /故事地图|章节地图/ }).last().click()
  assert.equal(await page.locator('.map-node.done').count(), 1)
  await page.locator('.map-node').first().click()
  await page.getByRole('button', { name: /重读章节/ }).click()
  assert.equal(await page.locator('.reader-content h1').filter({ hasText: '被开除的实习生' }).count(), 1)
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '故事模式', exact: true }).first().click()
  assert.equal(await page.locator('.map-node.done').count(), 1)
  await page.getByRole('button', { name: /选择学习词书/ }).click()
  await page.getByRole('button', { name: /CEFR A1/ }).click()
  await page.getByRole('button', { name: /打开章节地图/ }).click()
  await page.locator('.map-node').first().click()
  await page.getByRole('button', { name: /进入章节/ }).click()
  assert.equal(await page.locator('.story-text .word-mark').filter({ hasText: 'fake' }).count(), 1)
  await page.locator('.language-select').selectOption('en')
  assert.equal(await page.locator('.reader-content h1').filter({ hasText: 'The Fired Intern' }).count(), 1)
  await page.locator('.language-select').selectOption('zh-HK')
  assert.equal(await page.locator('.reader-content h1').filter({ hasText: '被炒嘅實習生' }).count(), 1)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('.language-select').inputValue(), 'zh-HK')
  await page.locator('.language-select').selectOption('zh-CN')

  await page.getByRole('button', { name: '笔记闯关', exact: true }).click()
  await page.getByRole('button', { name: '填入示例笔记' }).click()
  await page.getByRole('button', { name: /创建游戏/ }).click()
  assert.equal(await page.locator('.game-mode-card').count(), 2)
  await page.locator('.adventure-card').click()
  await page.locator('.quest-card .quiz-options button').filter({ hasText: /uniquely identifies each record/ }).click()
  assert.equal(await page.getByText(/线索解锁/).count(), 1)
  await page.getByRole('button', { name: /调查下一条线索/ }).click()
  await page.getByRole('button', { name: /选择其他游戏/ }).click()
  await page.locator('.matching-card').click()
  await page.locator('.match-card.term').first().click()
  await page.locator('.match-card.definition').filter({ hasText: /uniquely identifies each record/ }).click()
  assert.equal(await page.locator('.match-card.term.matched').count(), 1)

  const pdfPage = await browser.newPage()
  await pdfPage.setContent('<html><body style="font: 20px Arial"><p>Orbit: The path of an object around a star.</p><p>Gravity: A force that attracts objects to each other.</p><p>Mass: The amount of matter in an object.</p></body></html>')
  const pdfBuffer = await pdfPage.pdf({ format: 'A4' })
  await pdfPage.close()
  await page.getByRole('button', { name: /选择其他游戏/ }).first().click()
  await page.getByRole('button', { name: /修改笔记/ }).click()
  await page.evaluate((base64) => {
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))
    const file = new File([bytes], 'physics.pdf', { type: 'application/pdf' })
    const transfer = new DataTransfer()
    transfer.items.add(file)
    document.querySelector('.drop-zone').dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true }))
  }, pdfBuffer.toString('base64'))
  await page.getByText(/physics.pdf ·/).waitFor()
  assert.match(await page.locator('#notes-content').inputValue(), /Gravity:/)
  await page.getByRole('button', { name: /创建游戏/ }).click()
  assert.equal(await page.getByText(/Orbit · Gravity · Mass/).count(), 1)
  await page.getByRole('button', { name: /修改笔记/ }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'bad.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('bad') })
  assert.equal(await page.getByText('请选择 PDF、TXT 或 MD 文件。').count(), 1)
  await page.locator('input[type=file]').setInputFiles({ name: 'broken.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a pdf') })
  await page.getByText('无法读取此 PDF。请检查文件是否损坏。').waitFor()
  const blankPage = await browser.newPage()
  await blankPage.setContent('<html><body><div style="height:200px;background:#ddd"></div></body></html>')
  const blankPdf = await blankPage.pdf({ format: 'A4' })
  await blankPage.close()
  await page.locator('input[type=file]').setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: blankPdf })
  await page.getByText(/没有可提取文字/).waitFor()
  await page.locator('input[type=file]').setInputFiles({ name: 'huge.txt', mimeType: 'text/plain', buffer: Buffer.alloc(8 * 1024 * 1024 + 1) })
  assert.equal(await page.getByText('文件请控制在 8 MB 以内。').count(), 1)

  const gamesContext = await browser.newContext()
  const games = await gamesContext.newPage()
  await games.goto(url, { waitUntil: 'networkidle' })
  await games.getByRole('button', { name: '笔记闯关', exact: true }).click()
  await games.getByRole('button', { name: '填入示例笔记' }).click()
  await games.getByRole('button', { name: /创建游戏/ }).click()
  await games.locator('.adventure-card').click()
  const noteConcepts = await games.evaluate(async () => {
    const { parseNotes, sampleNotes } = await import('/src/logic.ts')
    return parseNotes(sampleNotes)
  })
  for (let index = 0; index < noteConcepts.length; index++) {
    await games.locator('.quest-card .quiz-options button').filter({ hasText: noteConcepts[index].definition }).click()
    await games.getByRole('button', { name: index === noteConcepts.length - 1 ? '挑战结果' : '调查下一条线索' }).click()
  }
  assert.equal(await games.getByText('任务完成').count(), 1)
  await games.getByRole('button', { name: /选择其他游戏/ }).first().click()
  await games.locator('.matching-card').click()
  await games.locator('.match-card.term').first().click()
  await games.locator('.match-card.definition').filter({ hasText: noteConcepts[1].definition }).click()
  assert.equal(await games.getByText('还不对，再试一次。').count(), 1)
  for (const item of noteConcepts) {
    await games.locator('.match-card.term').filter({ hasText: item.term }).click()
    await games.locator('.match-card.definition').filter({ hasText: item.definition }).click()
  }
  await games.getByText('任务完成').waitFor()
  assert.equal(await games.locator('.result-split').getByText('Primary Key').count(), 1)
  await games.getByRole('button', { name: /再玩一次/ }).click()
  assert.equal(await games.locator('.match-card.term.matched').count(), 0)
  await games.locator('.language-select').selectOption('en')
  assert.equal(await games.getByRole('heading', { name: 'Concept Match Lab' }).count(), 1)
  await gamesContext.close()

  const fullContext = await browser.newContext()
  const full = await fullContext.newPage()
  await full.goto(url, { waitUntil: 'networkidle' })
  await full.getByRole('button', { name: /开启你的故事/ }).click()
  await full.getByRole('button', { name: /打开章节地图/ }).click()
  await full.locator('.map-node').first().click()
  await full.getByRole('button', { name: /进入章节/ }).click()
  for (let chapter = 0; chapter < 6; chapter++) {
    const words = await full.evaluate(async (chapterIndex) => {
      const { getChapters } = await import('/src/data.ts')
      return getChapters('ielts')[chapterIndex].segments.map((segment) => segment.focus)
    }, chapter)
    for (let segment = 0; segment < 3; segment++) {
      await full.locator('.answer-option').filter({ hasText: words[segment] }).click()
      if (chapter === 3 && segment === 1) {
        await full.getByRole('button', { name: '先听她解释' }).click()
        assert.equal(await full.getByText(/医院账单/).count(), 1)
      }
      await full.getByRole('button', { name: segment === 2 ? '进入章节挑战' : '继续剧情' }).click()
    }
    const quizAnswers = await full.evaluate(async (chapterIndex) => {
      const { getChapters } = await import('/src/data.ts')
      const { makeQuestions } = await import('/src/logic.ts')
      return makeQuestions('ielts', getChapters('ielts')[chapterIndex].quizWords, 0).map((question) => question.answer)
    }, chapter)
    for (let question = 0; question < 5; question++) {
      await full.locator('.quiz-options button').filter({ hasText: quizAnswers[question] }).click()
      await full.getByRole('button', { name: question === 4 ? '查看挑战结果' : '下一题' }).click()
    }
    assert.equal(await full.locator('.result-orbit.pass').count(), 1)
    if (chapter < 5) await full.getByRole('button', { name: /进入下一章/ }).click()
  }
  assert.equal((await full.evaluate(() => JSON.parse(localStorage.getItem('plottwist-progress-v1')).books.ielts.completed)).length, 6)
  assert.equal(await full.evaluate(() => JSON.parse(localStorage.getItem('plottwist-progress-v1')).books.ielts.xp), 600)
  await full.getByRole('button', { name: '故事模式', exact: true }).first().click()
  await full.locator('.map-node').first().click()
  await full.getByRole('button', { name: /重做章节测试/ }).click()
  const replayAnswers = await full.evaluate(async () => {
    const { getChapters } = await import('/src/data.ts')
    const { makeQuestions } = await import('/src/logic.ts')
    return makeQuestions('ielts', getChapters('ielts')[0].quizWords, 0).map((question) => question.answer)
  })
  for (let question = 0; question < 5; question++) {
    await full.locator('.quiz-options button').filter({ hasText: replayAnswers[question] }).click()
    await full.getByRole('button', { name: question === 4 ? '查看挑战结果' : '下一题' }).click()
  }
  assert.equal(await full.evaluate(() => JSON.parse(localStorage.getItem('plottwist-progress-v1')).books.ielts.xp), 600)
  await fullContext.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await mobile.goto(url, { waitUntil: 'networkidle' })
  await mobile.screenshot({ path: 'artifacts/v2-mobile.png', fullPage: true })
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await mobile.close()
  assert.deepEqual(errors, [])
  console.log('V2 browser smoke passed: six chapters, replay XP cap, map, narration controls, books, locales, notes games, PDF drop, mobile.')
} finally {
  await context.close()
  await browser.close()
  await vite.close()
}
