import { useRef } from 'react'
import { projects } from '../data/content.js'
import Icon from './Icon.jsx'
import ProjectVisual from './ProjectVisual.jsx'
import SectionHeading from './SectionHeading.jsx'

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)

  const handleMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
    card.style.setProperty('--rx', `${(0.5 - y) * 5}deg`)
    card.style.setProperty('--ry', `${(x - 0.5) * 7}deg`)
  }

  const handleLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--mx', '50%')
    card.style.setProperty('--my', '50%')
  }

  return (
    <article
      className={`project-card project-card-${index === 4 ? 'full' : index === 0 || index === 3 ? 'wide' : 'narrow'}`}
      ref={cardRef}
      style={{ '--accent': project.accent }}
      data-reveal
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
        <div className="project-visual-wrap">
          <ProjectVisual project={project} />
          <span className="project-number">{project.index}</span>
          <span className="project-year">{project.year}</span>
        </div>

        <div className="project-content">
          <div className="project-category">
            <span className="project-category-line" aria-hidden="true" />
            {project.category}
          </div>
          <h3 className="project-title">
            {project.title}
            <span className="project-open">
              <Icon name="arrowUpRight" size={20} />
            </span>
          </h3>
          <p className="project-desc">{project.description}</p>
          <div className="project-foot">
            <span className="project-metric">{project.metric}</span>
            <ul className="project-tags" aria-label={`${project.title} 技术标签`}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>

        <span className="project-spotlight" aria-hidden="true" />
      </a>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="work" className="section work">
      <div className="container">
        <SectionHeading
          index="04"
          label="作品"
          title={
            <>
              写过的东西，
              <br />
              都带着体温。
            </>
          }
          lead="从实时渲染、浏览器可视化、程序化资产，到扛住流量的 Java 与 Go 服务。"
        />

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.id} />
          ))}
        </div>

        <div className="work-foot" data-reveal>
          <p>更多实验性项目与代码片段，见 GitHub。</p>
          <a className="text-link" href="https://github.com/" target="_blank" rel="noreferrer">
            <Icon name="github" size={18} />
            查看 GitHub
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
