import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
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

async function completeEntryQuiz(targetPage) {
  await targetPage.getByRole('button', { name: /IELTS 英语/ }).last().click()
  await targetPage.getByRole('button', { name: '继续', exact: true }).click()
}

try {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /开启你的故事/ }).click()
  await completeEntryQuiz(page)
  await page.getByRole('button', { name: /IELTS Vocabulary/ }).click()
  await page.getByRole('button', { name: /打开章节地图/ }).click()

  assert.equal(await page.locator('.map-node').count(), 6)
  await page.locator('.map-node').nth(1).click()
  assert.equal(await page.getByText('上一章挑战达到 80% 即可解锁').count(), 1)

  // Unlocked pins now open their story directly instead of requiring a second action.
  await page.locator('.map-node').first().click()
  assert.equal(await page.locator('.reader-content h1').filter({ hasText: '被开除的实习生' }).count(), 1)
  assert.equal(await page.locator('.scene-image.scene-image-1').count(), 1)
  assert.match(await page.locator('.scene-image').getAttribute('src'), /chapter-1\.svg/)

  // Each completed segment uses a different crop of the chapter artwork.
  await page.locator('.answer-option').filter({ hasText: 'fabricated' }).click()
  await page.getByRole('button', { name: '继续剧情' }).click()
  assert.equal(await page.locator('.scene-image.scene-image-2').count(), 1)

  await page.locator('.language-select').selectOption('zh-HK')
  assert.equal(await page.locator('.reader-content h1').filter({ hasText: '被炒嘅實習生' }).count(), 1)
  assert.equal(await page.getByText('閱讀中').count(), 1)
  await page.locator('.language-select').selectOption('zh-CN')
  assert.equal(await page.getByText('正在阅读').count(), 1)

  await page.getByRole('button', { name: '学习档案', exact: true }).click()
  assert.equal(await page.getByText(/XP 说明：首次通过每章挑战/).count(), 1)

  await page.getByRole('button', { name: '笔记闯关', exact: true }).click()
  await page.getByRole('button', { name: '填入示例笔记' }).click()
  await page.getByRole('button', { name: /创建游戏/ }).click()
  assert.equal(await page.locator('.notes-level-card').count(), 4)
  await page.locator('.language-select').selectOption('zh-HK')
  assert.equal(await page.locator('.notes-mission-board h1').filter({ hasText: '揀你嘅任務' }).count(), 1)

  assert.deepEqual(errors, [])
  console.log('Browser smoke passed: direct story map navigation, responsive chapter artwork, XP guidance, and zh-CN/zh-HK UI.')
} finally {
  await context.close()
  await browser.close()
  await vite.close()
}
