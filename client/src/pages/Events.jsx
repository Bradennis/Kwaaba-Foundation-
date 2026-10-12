import { useState } from 'react'
import { PageBanner, CtaBand } from '../components/sections.jsx'
import { SectionHead, Reveal } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiMapPin, FiCalendar } from 'react-icons/fi'

function fmt(d) {
  const dt = new Date(d)
  return { day: dt.getDate(), mon: dt.toLocaleString('en', { month: 'short' }), yr: dt.getFullYear() }
}

export default function Events() {
  const { content } = useContent()
  const [tab, setTab] = useState('upcoming')
  const list = content.events.filter((e) => e.status === tab)
  return (
    <>
      <PageBanner
        title="Events"
        text="From MarchMarch blood donation walks to borehole commissions — see where we've been and where we're going."
        image="/images/march-0405.jpeg"
        crumbs={[{ label: 'Events' }]}
      />
      <section className="section">
        <div className="container">
          <div className="tabs">
            <button className={tab === 'upcoming' ? 'on' : ''} onClick={() => setTab('upcoming')}>Upcoming Events</button>
            <button className={tab === 'past' ? 'on' : ''} onClick={() => setTab('past')}>Past Events</button>
          </div>
          <div style={{ display: 'grid', gap: 26 }}>
            {list.map((e, i) => {
              const d = fmt(e.date)
              return (
                <Reveal key={e.id} delay={i * 0.07}>
                  <article className="card" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', alignItems: 'stretch' }}>
                    <div style={{ position: 'relative', minHeight: 210 }}>
                      <img src={e.image} alt={e.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      <span className="tag" style={{ position: 'absolute', top: 14, left: 14, background: 'var(--blue)', color: '#fff', fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 3 }}>
                        {d.mon} {d.day}, {d.yr}
                      </span>
                    </div>
                    <div style={{ padding: 30 }}>
                      <h3 style={{ fontSize: '1.35rem' }}>{e.title}</h3>
                      <p style={{ color: 'var(--orange)', fontSize: 13, fontWeight: 600, margin: '8px 0 12px' }}>
                        <FiMapPin style={{ verticalAlign: -2 }} /> {e.location}
                      </p>
                      <p style={{ color: 'var(--grey)', lineHeight: 1.75 }}>{e.description}</p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
            {list.length === 0 && (
              <p style={{ color: 'var(--grey)' }}>
                {tab === 'upcoming' ? 'No upcoming events scheduled right now — check back soon, or follow our newsletter.' : 'No past events yet.'}
              </p>
            )}
          </div>
        </div>
      </section>
      <CtaBand
        title="Join us: MarchMarch — Our Annual Blood Donation Awareness Walk & Campaign"
        text="Let your blood count! Every donor plants hope with fruit-tree seedlings."
        button="Volunteer With Us"
        to="/volunteer"
      />
    </>
  )
}
