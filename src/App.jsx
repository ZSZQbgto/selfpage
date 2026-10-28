import { useCallback, useEffect, useState } from 'react'
import { profile } from './data/content.js'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Cursor from './components/Cursor.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import Journey from './components/Journey.jsx'
import Loader from './components/Loader.jsx'
import Marquee from './components/Marquee.jsx'
import Nav from './components/Nav.jsx'
import Pipeline from './components/Pipeline.jsx'
import Projects from './components/Projects.jsx'
import TechStack from './components/TechStack.jsx'

const SECTION_IDS = profile.nav.map((item) => item.id)

export default function App() {
  const [activeTech, setActiveTech] = useState(null)
  const [activeSection, setActiveSection] = useState('top')
  const [loading, setLoading] = useState(true)

  const handleLoaded = useCallback(() => setLoading(false), [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))
    if (reduceMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.05 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#top') setActiveSection('top')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      {loading ? <Loader onDone={handleLoaded} /> : null}
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav active={activeSection} />

      <main id="main">
        <Hero activeTech={activeTech} />
        <Marquee />
        <About />
        <TechStack activeKey={activeTech ?? 'webgl'} onChange={setActiveTech} />
        <Pipeline />
        <Projects />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
