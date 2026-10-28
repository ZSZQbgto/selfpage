import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173/'
const OUT = path.resolve('.shots')
const only = process.env.SHOTS

fs.mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
  ],
})

const messages = []

async function setupPage(width, height, options = {}) {
  const page = await browser.newPage()
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      messages.push(`[console.${message.type()}] ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => messages.push(`[pageerror] ${error.message}`))
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: options.mobile || false })
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await sleep(2600)
  return page
}

async function shot(page, name) {
  if (only && !name.includes(only)) return
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file })
  console.log('saved', file)
}

async function scrollTo(page, selector, offset = -60) {
  await page.evaluate(
    (target, extra) => {
      const element = document.querySelector(target)
      if (!element) return
      const top = element.getBoundingClientRect().top + window.scrollY + extra
      window.scrollTo({ top, behavior: 'instant' })
    },
    selector,
    offset,
  )
  await sleep(1100)
}

const desktop = await setupPage(1440, 900)
await shot(desktop, 'desktop-hero')
await desktop.screenshot({ path: path.join(OUT, 'desktop-full.png'), fullPage: true })
console.log('saved', path.join(OUT, 'desktop-full.png'))
for (const [name, selector] of Object.entries({
  'desktop-about': '#about',
  'desktop-stack': '#stack',
  'desktop-pipeline': '#pipeline',
  'desktop-work': '#work',
  'desktop-journey': '#journey',
  'desktop-contact': '#contact',
})) {
  await scrollTo(desktop, selector)
  await shot(desktop, name)
}

await scrollTo(desktop, '.project-card-full', -110)
await shot(desktop, 'desktop-work-full')

await desktop.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
await sleep(1100)
await shot(desktop, 'desktop-footer')

await scrollTo(desktop, '#stack')
await desktop.click('.stack-row:nth-child(1)')
await sleep(700)
await shot(desktop, 'desktop-stack-java')

const wide = await setupPage(1920, 1080)
await shot(wide, 'wide-hero')
await scrollTo(wide, '#work')
await shot(wide, 'wide-work')

const mobile = await setupPage(390, 844, { mobile: true })
await shot(mobile, 'mobile-hero')
for (const [name, selector] of Object.entries({
  'mobile-about': '#about',
  'mobile-stack': '#stack',
  'mobile-work': '#work',
  'mobile-journey': '#journey',
  'mobile-contact': '#contact',
})) {
  await scrollTo(mobile, selector, -50)
  await shot(mobile, name)
}
await scrollTo(mobile, '.project-card-full', -80)
await shot(mobile, 'mobile-work-full')
await mobile.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
await sleep(900)
await shot(mobile, 'mobile-footer')

await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await sleep(500)
await mobile.click('.nav-toggle')
await sleep(900)
await shot(mobile, 'mobile-menu')

await browser.close()

if (messages.length) {
  console.log('\n--- browser messages ---')
  console.log([...new Set(messages)].join('\n'))
} else {
  console.log('\nNo console errors or warnings.')
}
