export default function SectionHeading({ eyebrow, title, note, number }) {
  return <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</p><h2>{title}</h2>{note && <p className="section-note">{note}</p>}</div>{number && <span className="section-number">{number}</span>}</div>
}
