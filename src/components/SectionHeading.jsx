export default function SectionHeading({ index, label, title, lead, className = '' }) {
  return (
    <header className={`section-heading ${className}`.trim()} data-reveal>
      <div className="section-eyebrow">
        <span className="section-index">{index}</span>
        <span className="section-rule" aria-hidden="true" />
        <span className="section-label">{label}</span>
      </div>
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </header>
  )
}
