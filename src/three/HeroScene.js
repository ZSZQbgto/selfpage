import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const LABELS = [
  { key: 'java', text: 'JAVA', color: '#ffb26b', position: [2.72, 0.2, 0.55] },
  { key: 'go', text: 'GO', color: '#5fd4f4', position: [2.15, 1.45, 0.95] },
  { key: 'opengl', text: 'OPENGL', color: '#8fd3ff', position: [0.35, 2.15, -0.35] },
  { key: 'webgl', text: 'WEBGL', color: '#a78bfa', position: [-2.45, -0.35, 0.6] },
  { key: 'blender', text: 'BLENDER', color: '#ff9d5c', position: [-1.95, -1.55, 0.75] },
  { key: 'glsl', text: 'GLSL', color: '#5eead4', position: [0.35, -2.15, 0.9] },
  { key: 'react', text: 'REACT', color: '#67e8f9', position: [2.0, 0.9, 1.15] },
]

function makePointTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)')
  gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.28)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(190, 255, 248, 1)')
  gradient.addColorStop(0.22, 'rgba(94, 234, 212, 0.55)')
  gradient.addColorStop(0.55, 'rgba(124, 108, 255, 0.16)')
  gradient.addColorStop(1, 'rgba(6, 7, 11, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeLabelTexture(text, color) {
  const width = 512
  const height = 128
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)

  // pill
  const pillWidth = 400
  const pillHeight = 78
  const x = (width - pillWidth) / 2
  const y = (height - pillHeight) / 2
  ctx.beginPath()
  ctx.roundRect(x, y, pillWidth, pillHeight, 39)
  ctx.fillStyle = 'rgba(8, 11, 18, 0.72)'
  ctx.fill()
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.globalAlpha = 1

  // dot
  ctx.beginPath()
  ctx.arc(x + 42, height / 2, 7, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()

  ctx.font = '500 40px "JetBrains Mono", "Cascadia Code", monospace'
  ctx.fillStyle = '#eef2ff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + 68, height / 2 + 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function createKnotPoints() {
  const geometry = new THREE.TorusKnotGeometry(1.42, 0.44, 260, 40, 2, 3)
  const position = geometry.getAttribute('position')
  const count = 2600
  const stride = Math.max(1, Math.floor(position.count / count))
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const colorA = new THREE.Color('#6ee7ff')
  const colorB = new THREE.Color('#a78bfa')
  const colorC = new THREE.Color('#ffb26b')
  const tmp = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const source = (i * stride) % position.count
    const x = position.getX(source) + (Math.random() - 0.5) * 0.035
    const y = position.getY(source) + (Math.random() - 0.5) * 0.035
    const z = position.getZ(source) + (Math.random() - 0.5) * 0.035
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    const ratio = clamp((x + 1.8) / 3.6, 0, 1)
    tmp.copy(colorA).lerp(colorB, ratio)
    if (Math.abs(y) > 0.9) tmp.lerp(colorC, 0.35)
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }

  geometry.dispose()

  const pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return pointsGeometry
}

function createStarfield(count, radiusMin, radiusMax, palette) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    color.set(palette[Math.floor(Math.random() * palette.length)])
    color.multiplyScalar(0.55 + Math.random() * 0.45)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

export class HeroScene {
  constructor(canvas) {
    this.canvas = canvas
    this.elapsed = 0
    this.lastFrame = performance.now()
    this.pointer = new THREE.Vector2(0, 0)
    this.pointerTarget = new THREE.Vector2(0, 0)
    this.scroll = 0
    this.running = false
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.activeTech = null
    this.labels = new Map()
    this.labelBaseOpacity = 0.92
    this.rigBaseY = 0

    this.init()
  }

  init() {
    const { canvas } = this
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.renderer.setSize(width, height, false)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120)
    this.camera.position.set(0, 0.15, 9.6)
    this.pointTexture = makePointTexture()

    this.rig = new THREE.Group()
    this.scene.add(this.rig)

    this.buildCore()
    this.buildRings()
    this.buildLabels()
    this.buildStars()

    this.composer = new EffectComposer(this.renderer)
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.composer.setSize(width, height)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.85, 0.6, 0.12)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())

    this.onPointerMove = (event) => {
      this.pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1
      this.pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    this.onScroll = () => {
      this.scroll = window.scrollY || 0
      // The hero is the only place the canvas is visible; stop paying for
      // frames once it has scrolled away and resume when it comes back.
      if (this.scroll < window.innerHeight * 1.7) this.play()
      else this.pause()
    }
    this.onResize = () => this.resize()
    this.onVisibility = () => {
      if (document.hidden) this.pause()
      else if (this.scroll < window.innerHeight * 1.7) this.play()
    }

    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibility)

    this.onScroll()
    this.resize()
    this.play()

    if (this.reducedMotion) {
      this.elapsed = 2
      this.render(0.016)
      this.pause()
    }
  }

  buildCore() {
    this.core = new THREE.Group()
    this.core.rotation.z = -0.28
    this.rig.add(this.core)

    // Volumetric-looking point cloud shaped as a torus knot.
    this.knotGeometry = createKnotPoints()
    this.knotMaterial = new THREE.PointsMaterial({
      size: 0.03,
      map: this.pointTexture,
      alphaTest: 0.001,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    this.knot = new THREE.Points(this.knotGeometry, this.knotMaterial)
    this.core.add(this.knot)

    // Ghost wireframe cage.
    this.cageGeometry = new THREE.TorusKnotGeometry(1.42, 0.44, 140, 14, 2, 3)
    this.cageMaterial = new THREE.MeshBasicMaterial({
      color: '#8b7bff',
      wireframe: true,
      transparent: true,
      opacity: 0.055,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.cage = new THREE.Mesh(this.cageGeometry, this.cageMaterial)
    this.core.add(this.cage)

    // Central glow.
    this.glowTexture = makeGlowTexture()
    this.glowMaterial = new THREE.SpriteMaterial({
      map: this.glowTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.glow = new THREE.Sprite(this.glowMaterial)
    this.glow.scale.set(3.4, 3.4, 1)
    this.core.add(this.glow)

    // Faceted inner body.
    this.icoGeometry = new THREE.IcosahedronGeometry(0.62, 1)
    this.icoMaterial = new THREE.MeshBasicMaterial({
      color: '#0b1220',
      transparent: true,
      opacity: 0.9,
    })
    this.ico = new THREE.Mesh(this.icoGeometry, this.icoMaterial)
    this.core.add(this.ico)

    this.icoWireGeometry = new THREE.IcosahedronGeometry(0.64, 1)
    this.icoWireMaterial = new THREE.MeshBasicMaterial({
      color: '#c4b5fd',
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.icoWire = new THREE.Mesh(this.icoWireGeometry, this.icoWireMaterial)
    this.core.add(this.icoWire)
  }

  buildRings() {
    this.rings = new THREE.Group()
    this.rig.add(this.rings)

    const ringConfigs = [
      { radius: 2.35, tube: 0.004, rotation: [Math.PI / 2.6, 0.15, 0], opacity: 0.35 },
      { radius: 2.9, tube: 0.003, rotation: [Math.PI / 2.1, -0.4, 0.5], opacity: 0.22 },
      { radius: 3.45, tube: 0.0025, rotation: [Math.PI / 1.8, 0.2, -0.35], opacity: 0.16 },
    ]

    this.ringMeshes = ringConfigs.map((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 3, 240)
      const material = new THREE.MeshBasicMaterial({
        color: '#7c6cff',
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.set(...config.rotation)
      this.rings.add(ring)
      return ring
    })

    // Icosahedron outer cage.
    this.outerGeometry = new THREE.IcosahedronGeometry(2.05, 1)
    this.outerMaterial = new THREE.MeshBasicMaterial({
      color: '#6ee7ff',
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.outer = new THREE.Mesh(this.outerGeometry, this.outerMaterial)
    this.rings.add(this.outer)
  }

  buildLabels() {
    this.labelGroup = new THREE.Group()
    this.rig.add(this.labelGroup)

    LABELS.forEach((label, index) => {
      const texture = makeLabelTexture(label.text, label.color)
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: this.labelBaseOpacity,
        depthWrite: false,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(material)
      const [x, y, z] = label.position
      sprite.position.set(x, y, z)
      sprite.scale.set(1.18, 0.295, 1)
      sprite.renderOrder = 10
      sprite.userData = { ...label, baseScale: 1.18, angle: index, radius: 3, baseY: y }
      this.labelGroup.add(sprite)
      this.labels.set(label.key, sprite)
    })
  }

  buildStars() {
    this.starsGeometry = createStarfield(1700, 7, 24, ['#9be8ff', '#c4b5fd', '#f8fafc', '#67e8f9'])
    this.starsMaterial = new THREE.PointsMaterial({
      size: 0.055,
      map: this.pointTexture,
      alphaTest: 0.001,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    this.stars = new THREE.Points(this.starsGeometry, this.starsMaterial)
    this.scene.add(this.stars)

    this.dustGeometry = createStarfield(900, 3.2, 6.8, ['#5eead4', '#a78bfa', '#fbbf24'])
    this.dustMaterial = new THREE.PointsMaterial({
      size: 0.032,
      map: this.pointTexture,
      alphaTest: 0.001,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    this.dust = new THREE.Points(this.dustGeometry, this.dustMaterial)
    this.rig.add(this.dust)
  }

  setActiveTech(key) {
    this.activeTech = key
    this.labels.forEach((sprite, labelKey) => {
      const isActive = key === labelKey
      const base = this.labelBaseOpacity
      sprite.material.opacity = key == null ? base : isActive ? 1 : 0.28
      const scale = isActive ? 1.38 : 1.18
      sprite.scale.x = scale
      sprite.scale.y = scale * 0.25
    })
  }

  resize() {
    if (!this.renderer) return
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8)
    this.camera.aspect = width / height
    this.camera.fov = width < 768 ? 52 : 42
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height, false)
    this.composer.setPixelRatio(pixelRatio)
    this.composer.setSize(width, height)

    const isNarrow = width < 900
    this.rig.position.x = isNarrow ? 0 : 2.0
    this.rigBaseY = isNarrow ? -0.35 : 0
    this.rig.position.y = this.rigBaseY
    this.rig.scale.setScalar(isNarrow ? 0.62 : 1)
    this.labelGroup.visible = !isNarrow
  }

  render(delta) {
    const time = this.elapsed
    const motion = this.reducedMotion ? 0 : 1

    this.pointer.lerp(this.pointerTarget, 0.045)

    const heroProgress = clamp(this.scroll / (window.innerHeight * 0.9), 0, 1)
    const intro = easeOutCubic(clamp(time / 1.6, 0, 1))

    this.core.rotation.y = time * 0.14 * motion
    this.core.rotation.x = Math.sin(time * 0.22) * 0.12 * motion
    this.cage.rotation.y = -time * 0.09 * motion
    this.knot.scale.setScalar(0.72 + intro * 0.28)
    this.knotMaterial.opacity = intro * 0.95
    this.glow.scale.setScalar((3.4 + Math.sin(time * 1.6) * 0.12) * intro)
    this.ico.rotation.y = time * 0.4 * motion
    this.icoWire.rotation.y = -time * 0.28 * motion
    this.icoWire.rotation.x = time * 0.2 * motion

    this.rings.rotation.y = time * 0.045 * motion + this.pointer.x * 0.18
    this.rings.rotation.x = Math.sin(time * 0.16) * 0.08 * motion + this.pointer.y * 0.12
    this.outer.rotation.y = -time * 0.06 * motion
    this.outer.rotation.z = time * 0.03 * motion

    this.labelGroup.rotation.y = time * 0.07 * motion + this.pointer.x * 0.3
    this.labelGroup.rotation.x = this.pointer.y * 0.12
    this.labels.forEach((sprite) => {
      sprite.position.y = sprite.userData.baseY + Math.sin(time * 0.9 + sprite.userData.angle * 2.1) * 0.045 * motion
    })

    this.rig.rotation.y = this.pointer.x * 0.16
    this.rig.rotation.x = this.pointer.y * -0.1

    this.stars.rotation.y = time * 0.008 * motion + this.pointer.x * 0.05
    this.stars.rotation.x = time * 0.004 * motion
    this.dust.rotation.y = -time * 0.03 * motion

    this.camera.position.z = 9.6 + heroProgress * 2.6
    this.camera.position.x = this.pointer.x * 0.22
    this.camera.position.y = 0.15 - this.pointer.y * 0.18 - heroProgress * 0.35
    this.camera.lookAt(0, 0, 0)

    this.rig.position.y = this.rigBaseY - heroProgress * 0.6
    this.bloom.strength = 0.85 * (1 - heroProgress * 0.55)

    if (this.composer) this.composer.render(delta)
    else this.renderer.render(this.scene, this.camera)
  }

  play() {
    if (this.running || this.reducedMotion) return
    this.running = true
    this.lastFrame = performance.now()
    const loop = () => {
      if (!this.running) return
      this.raf = requestAnimationFrame(loop)
      const now = performance.now()
      const delta = Math.min((now - this.lastFrame) / 1000, 0.05)
      this.lastFrame = now
      this.elapsed += delta
      this.render(delta)
    }
    this.raf = requestAnimationFrame(loop)
  }

  pause() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  destroy() {
    this.pause()
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibility)

    const disposeMaterial = (material) => {
      if (!material) return
      if (material.map) material.map.dispose()
      material.dispose()
    }
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach(disposeMaterial)
        else disposeMaterial(object.material)
      }
    })
    this.glowTexture?.dispose()
    this.pointTexture?.dispose()
    this.composer?.dispose()
    this.renderer?.dispose()
  }
}
