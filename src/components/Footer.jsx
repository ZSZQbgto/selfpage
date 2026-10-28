import { profile } from '../data/content.js'
import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="footer-mail" href={`mailto:${profile.email}`}>
            {profile.email}
            <Icon name="arrowUpRight" size={18} />
          </a>

          <div className="footer-socials">
            {profile.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          LIN YU
        </div>

        <div className="footer-bottom">
          <span>© 2026 {profile.name}. All rights reserved.</span>
          <span className="footer-built">
            Built with <b>React</b> · <b>Three.js</b> · <b>GLSL</b>
          </span>
          <a className="footer-top-link" href="#top">
            回到顶部
            <Icon name="arrowUp" size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
