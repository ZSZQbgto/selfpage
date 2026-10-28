import { createRequire } from 'node:module'
import puppeteer from 'puppeteer-core'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
})

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await sleep(2600)
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(async () => {
    const audit = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    return audit.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.slice(0, 4).map((node) => node.target.join(' ')),
      count: violation.nodes.length,
    }))
  })
  console.log(`\n=== ${viewport.name} ===`)
  if (!results.length) console.log('No WCAG A/AA violations found.')
  for (const violation of results) {
    console.log(`[${violation.impact}] ${violation.id} (${violation.count}) — ${violation.help}`)
    console.log(`  ${violation.nodes.join(' | ')}`)
  }
  await page.close()
}

await browser.close()
