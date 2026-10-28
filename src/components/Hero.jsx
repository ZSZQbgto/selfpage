import { profile } from '../data/content.js'
import HeroCanvas from './HeroCanvas.jsx'
import Icon from './Icon.jsx'

const coreStack = ['Java', 'Go', 'OpenGL', 'WebGL', 'Blender', 'GLSL']

export default function Hero({ activeTech }) {
  return (
    <section id="top" className="hero" aria-label="首屏">
      <div className="hero-visual">
        <HeroCanvas activeTech={activeTech} />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
      </div>

      <div className="hero-rail" aria-hidden="true">
        <span>REALTIME VIEWPORT</span>
        <i />
        <span>WEBGL 2.0 / GLSL</span>
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="status-dot" aria-hidden="true" />
            {profile.kicker}
            <span className="hero-kicker-sep" aria-hidden="true" />
            {profile.location}
          </p>

          <h1 className="hero-title">
            {profile.headline.map((line, index) => (
              <span className={`hero-line ${index === 2 ? 'is-accent' : ''}`.trim()} key={line}>
                <span className="hero-line-inner" style={{ animationDelay: `${0.25 + index * 0.1}s` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-desc">{profile.tagline}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              查看作品
              <Icon name="arrowDown" size={18} />
            </a>
            <a className="btn btn-ghost" href="#about">
              关于我
              <Icon name="arrowUpRight" size={17} />
            </a>
          </div>

          <div className="hero-stack">
            <span className="hero-stack-label">CORE STACK</span>
            <ul>
              {coreStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="hero-bottom container">
        <ul className="hero-stats" aria-label="关键数据">
          {profile.stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        <a className="scroll-cue" href="#about">
          <span>SCROLL TO EXPLORE</span>
          <i className="scroll-line" aria-hidden="true">
            <b />
          </i>
        </a>
      </div>
    </section>
  )
}
