import { useState } from 'react'
import { PageBanner } from '../components/sections.jsx'
import { SectionHead, Reveal } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi'

export default function Contact() {
  const { content } = useContent()
  const s = content.settings
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4200)
    e.target.reset()
  }

  return (
    <>
      <PageBanner
        title="Contact Us"
        text="We would love to hear from you — ideas, partnerships, press or prayers, all count."
        image="/images/event-49.jpg"
        crumbs={[{ label: 'Contact' }]}
      />
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 26, marginTop: -70, position: 'relative', zIndex: 2 }}>
          {[
            { ico: FiPhone, t: 'Call Us', d: s.phone, href: `tel:${s.phoneShort?.replace(/\s/g, '')}` },
            { ico: FiMail, t: 'Email Us', d: s.email, href: `mailto:${s.email}` },
            { ico: FiMapPin, t: 'Find Us', d: s.address },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div className="admin-card" style={{ margin: 0 }}>
                <div className="info-tile">
                  <span className="ico"><c.ico /></span>
                  <div>
                    <h3>{c.t}</h3>
                    <p>{c.href ? <a href={c.href} style={{ color: 'var(--blue)' }}>{c.d}</a> : c.d}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <SectionHead kicker="Say Hello" title="Send Us a" em="Message" />
            <form className="admin-card" onSubmit={submit}>
              <div className="form-grid">
                <div className="field"><label>Full name</label><input required placeholder="Your name" /></div>
                <div className="field"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
                <div className="field full"><label>Subject</label><input placeholder="How can we help?" /></div>
                <div className="field full"><label>Message</label><textarea rows={5} required placeholder="Write your message..." /></div>
                <div className="full"><button className="btn btn--orange"><FiSend /> Send Message</button></div>
              </div>
            </form>
          </div>
          <Reveal delay={0.15}>
            <div className="media-stack">
              <div className="frame" style={{ aspectRatio: '4/4.6', background: 'var(--bg-soft)' }}>
                <iframe
                  title="Kwaaba Foundation location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.2500%2C5.5000%2C-0.1200%2C5.6000&layer=mapnik&marker=5.5500%2C-0.1850"
                  style={{ width: '100%', height: '100%', border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {sent && (
        <div className="toast">Thank you for reaching out — we will respond shortly.</div>
      )}
    </>
  )
}
