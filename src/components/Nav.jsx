import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content.js'
import Icon from './Icon.jsx'

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.documentElement.classList.add('is-menu-open')
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('is-menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`.trim()}>
        <div className="scroll-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
        <div className="nav-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">
              YL<span>.</span>
            </span>
            <span className="brand-text">
              林屿
              <em>LIN YU</em>
            </span>
          </a>

          <nav className="nav-links" aria-label="主导航">
            {profile.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'is-active' : undefined}>
                <span className="nav-index">{item.index}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="nav-cta" href="#contact">
              <span className="status-dot" aria-hidden="true" />
              联系我
            </a>
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? '关闭菜单' : '打开菜单'}
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="mobile-links" aria-label="移动端导航">
          {profile.nav.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={close}
              style={{ '--menu-delay': open ? `${90 + index * 45}ms` : '0ms' }}
            >
              <span>{item.index}</span>
              {item.label}
              <Icon name="arrowUpRight" size={18} />
            </a>
          ))}
        </nav>
        <div className="mobile-foot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <p>杭州 · 中国 / UTC+8</p>
        </div>
      </div>
    </>
  )
}
