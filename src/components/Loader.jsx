import { useEffect, useState } from 'react'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    const start = performance.now()
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 500 : 1500
    let raf = 0
    let timeout = 0

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setProgress(Math.round(easeOutExpo(t) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setFinished(true)
        timeout = window.setTimeout(() => {
          document.documentElement.classList.remove('is-loading')
          onDone()
        }, 650)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
      document.documentElement.classList.remove('is-loading')
    }
  }, [onDone])

  return (
    <div className={`loader ${finished ? 'is-finished' : ''}`.trim()} role="status" aria-live="polite">
      <div className="loader-inner">
        <div className="loader-mark">
          YL<span>.</span>
        </div>
        <div className="loader-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="loader-row">
          <span>INITIALIZING RENDERER</span>
          <span className="loader-count">{String(progress).padStart(3, '0')}</span>
        </div>
      </div>
      <span className="loader-note">REACT · THREE.JS · GLSL</span>
    </div>
  )
}
