import { marquee } from '../data/content.js'

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul className="marquee-group" key={copy}>
            {marquee.map((item) => (
              <li key={`${copy}-${item}`}>
                <span>{item}</span>
                <i />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
