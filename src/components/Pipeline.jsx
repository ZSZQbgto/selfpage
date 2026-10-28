import { pipeline } from '../data/content.js'
import SectionHeading from './SectionHeading.jsx'
import ShaderPreview from './ShaderPreview.jsx'

const codeLines = [
  [<span className="tk-com" key="1">// aurora.frag · 实时渐变</span>],
  [<span className="tk-key" key="1">uniform float</span>, <span key="2"> uTime;</span>],
  [<span className="tk-key" key="1">uniform vec2</span>, <span key="2"> uRes;</span>],
  [<span className="tk-key" key="1">void</span>, <span key="2"> main() {'{'}</span>],
  [<span key="1">  vec2 uv = </span>, <span className="tk-fn" key="2">gl_FragCoord.xy</span>, <span key="3"> / uRes;</span>],
  [<span key="1">  </span>, <span className="tk-key" key="2">float</span>, <span key="3"> t = uTime * </span>, <span className="tk-num" key="4">0.055</span>, <span key="5">;</span>],
  [<span key="1">  </span>, <span className="tk-key" key="2">float</span>, <span key="3"> n = </span>, <span className="tk-fn" key="4">fbm</span>, <span key="5">(p * </span>, <span className="tk-num" key="6">1.7</span>, <span key="7"> + vec2(t, -t));</span>],
  [<span key="1">  vec3 col = </span>, <span className="tk-fn" key="2">palette</span>, <span key="3">(n + t);</span>],
  [<span key="1">  col += vec3(</span>, <span className="tk-num" key="2">0.35</span>, <span key="3">, </span>, <span className="tk-num" key="4">0.9</span>, <span key="5">, </span>, <span className="tk-num" key="6">0.8</span>, <span key="7">) * glow(uv);</span>],
  [<span key="1">  </span>, <span className="tk-fn" key="2">gl_FragColor</span>, <span key="3"> = vec4(col, </span>, <span className="tk-num" key="4">1.0</span>, <span key="5">);</span>],
  [<span key="1">{'}'}</span>],
]

export default function Pipeline() {
  return (
    <section id="pipeline" className="section pipeline">
      <div className="container">
        <SectionHeading
          index="03"
          label="渲染管线"
          title={
            <>
              一帧 16.6 毫秒，
              <br />
              从顶点到像素。
            </>
          }
          lead="OpenGL 与 WebGL 共享同一条管线。理解它，才知道每一毫秒应该花在哪里。"
        />

        <div className="pipeline-layout">
          <ol className="pipeline-steps">
            {pipeline.map((step, index) => (
              <li
                key={step.index}
                className="pipeline-step"
                data-reveal
                style={{ '--reveal-delay': `${index * 60}ms` }}
              >
                <span className="pipeline-index">{step.index}</span>
                <div className="pipeline-body">
                  <div className="pipeline-head">
                    <h3>{step.title}</h3>
                    <span>{step.en}</span>
                  </div>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
            <li className="pipeline-quote" data-reveal>
              <span>“</span>
              <p>
                从 OpenGL 到 WebGL，管线没有变，
                <br />
                变的只是你离显卡的距离。
              </p>
            </li>
          </ol>

          <div className="shader-card" data-reveal>
            <div className="shader-head">
              <div className="traffic-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <span className="shader-file">aurora.frag</span>
              <span className="shader-live">
                <i aria-hidden="true" />
                LIVE
              </span>
            </div>

            <div className="shader-stage">
              <ShaderPreview />
              <div className="shader-stage-label">
                <span>GLSL</span>
                <span>实时计算 · 无贴图</span>
              </div>
            </div>

            <pre className="code" aria-label="片元着色器代码示例">
              <code>
                {codeLines.map((line, index) => (
                  <span className="code-line" key={index}>
                    <span className="code-gutter">{String(index + 1).padStart(2, '0')}</span>
                    <span className="code-text">{line}</span>
                  </span>
                ))}
              </code>
            </pre>

            <div className="shader-foot">
              <span>WEBGL 2.0</span>
              <span>FRAGMENT STAGE</span>
              <span>FBM + ACES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
