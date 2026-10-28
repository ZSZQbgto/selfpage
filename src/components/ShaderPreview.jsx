import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.055;
  float warp = fbm(p * 2.2 - t * 0.5);
  float n = fbm(p * 1.7 + vec2(t, -t * 0.6) + vec2(warp));

  vec3 deep = vec3(0.016, 0.034, 0.07);
  vec3 cyan = vec3(0.24, 1.0, 0.86);
  vec3 violet = vec3(0.58, 0.38, 1.0);
  vec3 amber = vec3(1.0, 0.64, 0.34);

  vec3 col = deep;
  col = mix(col, cyan, smoothstep(0.34, 0.94, n) * 0.82);
  col = mix(col, violet, smoothstep(0.14, 0.86, fbm(p * 1.15 + t * 0.8)) * 0.76);
  col += amber * pow(max(0.0, 0.58 - length(p - vec2(0.36, 0.08))), 2.6) * 0.5;

  float vignette = smoothstep(0.0, 1.25, 1.3 - length(p));
  col *= 0.62 + vignette * 0.72;
  col = pow(col, vec3(0.88));
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function ShaderPreview() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl =
      canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' }) ||
      canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' })

    if (!gl) {
      canvas.classList.add('is-unavailable')
      return undefined
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vertex || !fragment) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program))
      return undefined
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resLocation = gl.getUniformLocation(program, 'uRes')
    const timeLocation = gl.getUniformLocation(program, 'uTime')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = false
    let visible = true
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const draw = (time) => {
      resize()
      gl.uniform2f(resLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, reduceMotion ? 4.2 : (time - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (time) => {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    const play = () => {
      if (running || reduceMotion) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    if (reduceMotion) {
      draw(start)
    } else {
      play()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) play()
        else pause()
      },
      { threshold: 0.05 },
    )
    observer.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) pause()
      else if (visible) play()
    }
    const onResize = () => {
      resize()
      if (!running) draw(performance.now())
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      pause()
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} className="shader-canvas" aria-hidden="true" />
}
