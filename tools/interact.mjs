import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (name, pass, detail = '') => {
  results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
})

const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.setViewport({ width: 390, height: 844, isMobile: true })
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await sleep(2600)

// mobile menu opens
await page.click('.nav-toggle')
await sleep(600)
const openState = await page.evaluate(() => {
  const menu = document.querySelector('.mobile-menu')
  return {
    hidden: menu?.hidden,
    headerOpen: document.querySelector('.site-header')?.classList.contains('is-open'),
    expanded: document.querySelector('.nav-toggle')?.getAttribute('aria-expanded'),
  }
})
check('mobile menu opens', openState.hidden === false && openState.expanded === 'true', JSON.stringify(openState))

// mobile menu link navigates
await page.click('.mobile-links a[href="#about"]')
await sleep(1600)
const linkState = await page.evaluate(() => {
  const menu = document.querySelector('.mobile-menu')
  const about = document.querySelector('#about')
  return {
    hidden: menu?.hidden,
    scrollY: Math.round(window.scrollY),
    aboutTop: Math.round(about.getBoundingClientRect().top + window.scrollY),
    headerOpen: document.querySelector('.site-header')?.classList.contains('is-open'),
  }
})
check(
  'mobile menu link scrolls to section',
  linkState.hidden === true && linkState.scrollY > 300 && Math.abs(linkState.scrollY + 92 - linkState.aboutTop) < 400,
  JSON.stringify(linkState),
)

// tech tabs
await page.evaluate(() => {
  const el = document.querySelector('#stack')
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'instant' })
})
await sleep(900)
await page.click('#stack-tab-java')
await sleep(500)
const tabState = await page.evaluate(() => ({
  detailTitle: document.querySelector('.stack-detail h3')?.textContent,
  selected: document.querySelector('#stack-tab-java')?.getAttribute('aria-selected'),
  tabindex: document.querySelector('#stack-tab-java')?.getAttribute('tabindex'),
}))
check('tech tab updates panel', tabState.detailTitle === 'Java' && tabState.selected === 'true', JSON.stringify(tabState))

// keyboard arrow navigation on tabs
await page.focus('#stack-tab-java')
await page.keyboard.press('ArrowDown')
await sleep(400)
const keyboardState = await page.evaluate(() => ({
  detailTitle: document.querySelector('.stack-detail h3')?.textContent,
  focused: document.activeElement?.id,
}))
check(
  'tech tabs support arrow keys',
  keyboardState.detailTitle === 'Go' && keyboardState.focused === 'stack-tab-go',
  JSON.stringify(keyboardState),
)

// horizontal overflow checks
for (const width of [390, 768, 1024, 1440]) {
  await page.setViewport({ width, height: 900, isMobile: width < 700 })
  await sleep(400)
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  check(`no horizontal overflow @${width}`, overflow.scrollWidth <= overflow.innerWidth + 1, JSON.stringify(overflow))
}

// reduced motion content is visible
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.reload({ waitUntil: 'networkidle0' })
await sleep(1800)
const reduced = await page.evaluate(() => {
  const hidden = Array.from(document.querySelectorAll('[data-reveal]')).filter(
    (el) => getComputedStyle(el).opacity === '0',
  ).length
  return { hiddenRevealElements: hidden, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior }
})
check('reduced motion shows all content', reduced.hiddenRevealElements === 0, JSON.stringify(reduced))

check('no runtime errors', errors.length === 0, errors.join(' | '))
console.log(results.join('\n'))
await browser.close()
