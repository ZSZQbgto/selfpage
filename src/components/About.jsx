import { aboutCards, principles, profile } from '../data/content.js'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionHeading
          index="01"
          label="关于"
          title={
            <>
              工程师的理性，
              <br />
              创作者的偏执。
            </>
          }
          lead="我享受两种时刻：一是压测曲线终于变平的那一刻，二是画面里的光终于对的那一刻。"
        />

        <div className="about-grid">
          <div className="about-story" data-reveal>
            {profile.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="about-signature">
              <span className="signature-mark">YL</span>
              <div>
                <strong>{profile.name}</strong>
                <span>{profile.role}</span>
              </div>
            </div>

            <a className="text-link" href="#contact">
              和我聊聊
              <Icon name="arrowUpRight" size={17} />
            </a>
          </div>

          <div className="about-bento">
            {aboutCards.map((card, index) => (
              <article
                className={`bento-card ${card.wide ? 'is-wide' : ''}`.trim()}
                key={card.label}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
              >
                <div className="bento-head">
                  <span className="bento-icon">
                    <Icon name={card.icon} size={18} />
                  </span>
                  <span className="bento-label">{card.label}</span>
                </div>
                <h3>{card.title}</h3>
                {card.text ? <p>{card.text}</p> : null}
                {card.icon === 'now' ? <span className="bento-pulse" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="principles">
          {principles.map((item, index) => (
            <article
              className="principle"
              key={item.index}
              data-reveal
              style={{ '--reveal-delay': `${index * 90}ms` }}
            >
              <span className="principle-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
