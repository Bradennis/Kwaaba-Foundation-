import { useParams, Navigate, Link } from 'react-router-dom'
import { PageBanner, CtaBand } from '../components/sections.jsx'
import { Reveal, SectionHead } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'

export default function ProgramDetail() {
  const { slug } = useParams()
  const { content } = useContent()
  const p = content.programs.find((x) => x.slug === slug)
  if (!p) return <Navigate to="/programs" replace />
  const related = content.programs.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3)
  return (
    <>
      <PageBanner
        title={p.title}
        text={p.excerpt}
        image={p.image}
        crumbs={[{ label: 'What We Do', to: '/programs' }, { label: p.title }]}
      />
      <section className="section">
        <div className="container split">
          <div className="prose">
            <Reveal>
              {p.body.split('\n\n').map((para, i) =>
                para.startsWith('“') ? <blockquote key={i}>{para}</blockquote> : <p key={i}>{para}</p>,
              )}
            </Reveal>
          </div>
          <Reveal>
            <div className="media-stack">
              <span className="pattern" />
              <div className="frame" style={{ aspectRatio: '4/4.6' }}><img src={p.image} alt={p.title} /></div>
              <div className="badge"><b>{p.category}</b><small>Program area</small></div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--soft" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead kicker="Related" title="More in" em={p.category} />
            <div style={{ marginTop: 30 }}>
              {related.map((r) => (
                <Link key={r.id} to={`/programs/${r.slug}`} className="event-row" style={{ cursor: 'pointer' }}>
                  <img src={r.image} alt="" style={{ width: 110, height: 74, objectFit: 'cover', borderRadius: 8 }} />
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.excerpt}</p>
                  </div>
                  <span className="btn btn--outline btn--sm">View</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="We welcome your ideas on other ways you can support the cause."
        text="We would love to hear from you — call +233 277 592 222 or email info@kwaabafoundation.org."
        button="Get Involved"
        to="/contact"
      />
    </>
  )
}
