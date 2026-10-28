import { useRef } from 'react'
import { techStack } from '../data/content.js'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

const RING_RADIUS = 52
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function LevelRing({ level, color }) {
  return (
    <div className="level-ring" style={{ '--ring-color': color }}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`熟练度 ${level}%`}>
        <circle className="level-ring-track" cx="60" cy="60" r={RING_RADIUS} />
        <circle
          className="level-ring-fill"
          cx="60"
          cy="60"
          r={RING_RADIUS}
          strokeDasharray={`${(level / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span>
        <strong>{level}</strong>
        <small>%</small>
      </span>
    </div>
  )
}

export default function TechStack({ activeKey, onChange }) {
  const active = techStack.find((tech) => tech.key === activeKey) ?? techStack[0]
  const listRef = useRef(null)

  const handleKeyDown = (event) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    const tabs = Array.from(listRef.current?.querySelectorAll('[role="tab"]') ?? [])
    if (!tabs.length) return
    const current = tabs.findIndex((tab) => tab === document.activeElement)
    const start = current < 0 ? 0 : current
    let next = start
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (start + 1) % tabs.length
    else next = (start - 1 + tabs.length) % tabs.length
    event.preventDefault()
    tabs[next].focus()
    onChange(techStack[next].key)
  }

  // On narrow layouts the detail panel sits above the list, so hovering a row
  // can shift the list under the pointer and re-trigger hover. Only wire hover
  // selection up on wide layouts; touch and keyboard still select directly.
  const handleHover = (key) => {
    if (window.innerWidth >= 981) onChange(key)
  }

  return (
    <section id="stack" className="section stack">
      <div className="container">
        <SectionHeading
          index="02"
          label="技术栈"
          title={
            <>
              不只是会写，
              <br />
              而是知道为什么。
            </>
          }
          lead="七组关键词，覆盖从内核到像素的完整链路。每一项都对应真实交付过的系统，而不是简历上的名词。"
        />

        <div className="stack-layout">
          <div className="stack-list" role="tablist" aria-label="技术栈列表" ref={listRef} onKeyDown={handleKeyDown}>
            {techStack.map((tech, index) => {
              const isActive = tech.key === active.key
              return (
                <button
                  type="button"
                  key={tech.key}
                  id={`stack-tab-${tech.key}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="stack-detail"
                  tabIndex={isActive ? 0 : -1}
                  className={`stack-row ${isActive ? 'is-active' : ''}`.trim()}
                  style={{ '--tech-color': tech.color }}
                  onClick={() => onChange(tech.key)}
                  onMouseEnter={() => handleHover(tech.key)}
                  onFocus={() => onChange(tech.key)}
                >
                  <span className="stack-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="stack-main">
                    <span className="stack-name">{tech.name}</span>
                    <span className="stack-tagline">{tech.tagline}</span>
                  </span>
                  <span className="stack-category">{tech.category}</span>
                  <span className="stack-track" aria-hidden="true">
                    <span style={{ width: `${tech.level}%` }} />
                  </span>
                  <span className="stack-level">{tech.level}</span>
                  <span className="stack-arrow">
                    <Icon name="arrowUpRight" size={16} />
                  </span>
                </button>
              )
            })}
          </div>

          <aside
            className="stack-detail"
            id="stack-detail"
            role="tabpanel"
            aria-live="polite"
            aria-labelledby={`stack-tab-${active.key}`}
            style={{ '--tech-color': active.color }}
          >
            <div className="stack-detail-inner" key={active.key} style={{ '--tech-color': active.color }}>
              <span className="stack-watermark" aria-hidden="true">
                {active.name.split(' ')[0]}
              </span>

              <div className="stack-detail-head">
                <div>
                  <span className="stack-detail-category">
                    {active.category} / {active.years}
                  </span>
                  <h3>{active.name}</h3>
                </div>
                <LevelRing level={active.level} color={active.color} />
              </div>

              <p className="stack-detail-tagline">{active.tagline}</p>
              <p className="stack-detail-desc">{active.description}</p>

              <ul className="stack-tags" aria-label={`${active.name} 相关技术`}>
                {active.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <div className="stack-detail-foot">
                <span className="stack-detail-note">
                  <span className="pulse-dot" style={{ background: active.color }} aria-hidden="true" />
                  ACTIVE IN PRODUCTION
                </span>
                <span className="stack-detail-index">
                  0{techStack.findIndex((tech) => tech.key === active.key) + 1} / 0{techStack.length}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
