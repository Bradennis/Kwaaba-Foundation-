import { Link } from 'react-router-dom'
import { PageBanner } from '../components/sections.jsx'
import { SectionHead, Reveal, StaggerGroup, StaggerItem } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiDownload, FiFilm } from 'react-icons/fi'

export default function Resources() {
  const { content } = useContent()
  const mentions = content.posts.filter((p) => p.type === 'media')
  const years = [...new Set(content.newsletters.map((n) => n.year))].sort((a, b) => b - a)
  return (
    <>
      <PageBanner
        title="Resources"
        text="Dua Pa Quarterly newsletters, media mentions and the Foundation's projects documentation."
        image="/images/donation-app.jpg"
        crumbs={[{ label: 'Resources' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHead kicker="Newsletter" title="Dua Pa Quarterly" em="Newsletters" lead="Curated resource guides and quarterly updates from the field." />
          <div style={{ marginTop: 44, display: 'grid', gap: 30 }}>
            {years.map((y) => (
              <Reveal key={y}>
                <div>
                  <h3 style={{ marginBottom: 16, color: 'var(--blue)' }}>{y}</h3>
                  <div className="cards">
                    {content.newsletters.filter((n) => n.year === y).map((n) => (
                      <a key={n.id} href={n.url || '#'} className="card" style={{ padding: 24, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <span className="card-icon" style={{ margin: 0 }}><FiDownload /></span>
                        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 500, color: 'var(--navy)' }}>{n.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead kicker="Press" title="Media" em="Mentions" lead="Stories picked up by the press from our campaigns and projects." />
          <StaggerGroup className="cards" style={{ marginTop: 44 }}>
            {mentions.map((m) => (
              <StaggerItem key={m.id}>
                <article className="card">
                  <div className="card-media" style={{ height: 200 }}>
                    <img src={m.image} alt={m.title} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <span style={{ fontSize: 12, color: 'var(--grey)' }}>{new Date(m.date).toLocaleDateString('en', { year: 'numeric', month: 'long' })}</span>
                    <h3 style={{ fontSize: '1.12rem' }}>{m.title}</h3>
                    <p>{m.excerpt}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal>
            <div className="admin-card" style={{ marginTop: 46, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ width: 54, height: 54, borderRadius: 10, background: '#ffeee6', color: 'var(--orange)', display: 'grid', placeItems: 'center', fontSize: 22 }}><FiFilm /></span>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontSize: '1.1rem' }}>Videos</h3>
                <p style={{ color: 'var(--grey)', fontSize: 14.5, marginTop: 4 }}>
                  Watch campaign films and event highlights on our YouTube channel.
                </p>
              </div>
              <a className="btn btn--blue btn--sm" href={content.settings.youtube} target="_blank" rel="noreferrer">Watch on YouTube</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section text-center">
        <div className="container">
          <SectionHead center kicker="Photos" title="See Our Work" em="in Pictures" />
          <Reveal delay={0.1}>
            <div style={{ marginTop: 22 }}>
              <Link to="/gallery" className="btn btn--orange">Open the Photo Gallery</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
