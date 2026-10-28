import { useEffect, useRef } from 'react'
import { HeroScene } from '../three/HeroScene.js'

export default function HeroCanvas({ activeTech }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return undefined
    let scene
    try {
      scene = new HeroScene(canvasRef.current)
      sceneRef.current = scene
    } catch (error) {
      canvasRef.current.classList.add('is-unavailable')
      console.warn('WebGL scene unavailable, falling back to CSS visuals.', error)
      return undefined
    }
    return () => {
      scene.destroy()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setActiveTech(activeTech ?? null)
  }, [activeTech])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
