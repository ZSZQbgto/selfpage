import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    document.documentElement.classList.add('has-custom-cursor')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let raf = 0
    let visible = false

    const onMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY

      if (!visible) {
        visible = true
        dot.classList.add('is-visible')
        ring.classList.add('is-visible')
      }

      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      const interactive = event.target instanceof Element && event.target.closest('a, button, [data-cursor="hover"]')
      ring.style.setProperty('--cursor-scale', interactive ? '1.9' : '1')
      ring.classList.toggle('is-hover', Boolean(interactive))
    }

    const onLeave = () => {
      visible = false
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
    }

    const render = () => {
      ringX += (targetX - ringX) * 0.16
      ringY += (targetY - ringY) * 0.16
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(var(--cursor-scale, 1))`
      raf = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
