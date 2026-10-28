import { contact, profile } from '../data/content.js'
import Icon from './Icon.jsx'

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container">
        <div className="contact-grid">
          <div className="contact-main">
            <div className="section-eyebrow" data-reveal>
              <span className="section-index">06</span>
              <span className="section-rule" aria-hidden="true" />
              <span className="section-label">联系</span>
            </div>

            <h2 className="contact-title" data-reveal>
              {contact.title.map((line, index) => (
                <span className="contact-title-line" key={line}>
                  {line}
                  {index === 2 ? <span className="contact-dot">.</span> : null}
                </span>
              ))}
            </h2>

            <p className="contact-text" data-reveal>
              {contact.text}
            </p>

            <div className="contact-actions" data-reveal>
              <a className="contact-mail" href={`mailto:${profile.email}`}>
                <span>{profile.email}</span>
                <span className="contact-mail-icon">
                  <Icon name="arrowUpRight" size={22} />
                </span>
              </a>
              <span className="contact-status">
                <span className="status-dot" aria-hidden="true" />
                {profile.status}
              </span>
            </div>
          </div>

          <aside className="contact-side" data-reveal>
            <div className="contact-side-block">
              <span className="contact-side-label">SOCIAL</span>
              <ul className="contact-socials">
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer">
                      <span>
                        {social.label}
                        <em>{social.handle}</em>
                      </span>
                      <Icon name="arrowUpRight" size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-side-block">
              <span className="contact-side-label">ELSEWHERE</span>
              <div className="contact-meta">
                <span>{profile.location}</span>
                <span>{profile.coords}</span>
                <span>UTC+8 / 远程友好</span>
              </div>
            </div>

            <div className="contact-availability">
              <span className="contact-availability-ring" aria-hidden="true" />
              <p>
                可接受新的合作
                <br />
                <em>Open for freelance & full-time</em>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
