import { journey } from '../data/content.js'
import SectionHeading from './SectionHeading.jsx'

export default function Journey() {
  return (
    <section id="journey" className="section journey">
      <div className="container">
        <SectionHeading
          index="05"
          label="历程"
          title={
            <>
              一路写过来，
              <br />
              也一路画过来。
            </>
          }
          lead="从实验室里的第一张三角形，到生产环境的每一次发布。"
        />

        <ol className="timeline">
          {journey.map((item, index) => (
            <li
              key={item.period}
              className={`timeline-item ${index === 0 ? 'is-current' : ''}`.trim()}
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` }}
            >
              <div className="timeline-period">
                {index === 0 ? <span className="status-dot" aria-hidden="true" /> : null}
                {item.period}
              </div>
              <div className="timeline-marker" aria-hidden="true">
                <span />
              </div>
              <div className="timeline-content">
                <h3>{item.role}</h3>
                <span className="timeline-org">{item.org}</span>
                <p>{item.text}</p>
                <ul className="timeline-tags" aria-label="相关技术">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
