import { Reveal, SectionHead } from '../components/ui.jsx'
import { PageBanner, CtaBand } from '../components/sections.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiTarget } from 'react-icons/fi'

export default function About() {
  const { content } = useContent()
  const { about, founder } = content
  return (
    <>
      <PageBanner
        title="About Kwaaba Foundation"
        text="Supports health and community initiatives, engages and empowers people to achieve their full potential."
        image="/images/event-76.jpg"
        crumbs={[{ label: 'Who We Are' }, { label: 'About Kwaaba Foundation' }]}
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead kicker="Who We Are" title="A Registered NGO," em="Rooted in Dua Pa" />
            <div className="prose">
              {about.body.map((para, i) => (
                <Reveal key={i} delay={i * 0.08}><p>{para}</p></Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="media-stack">
              <span className="pattern" />
              <div className="frame" style={{ aspectRatio: '4/3.2' }}><img src={about.image} alt="Kwaaba Foundation" /></div>
              <div className="frame frame--back"><img src={about.imageBack} alt="" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark" style={{ padding: 'clamp(48px,6vw,84px) 0' }}>
        <div className="container" style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <Reveal>
            <span style={{ width: 70, height: 70, borderRadius: 14, background: 'var(--orange)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 30 }}><FiTarget /></span>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <span className="kicker" style={{ color: 'var(--bronze)' }}>Our Mission</span>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem,3vw,2rem)', marginTop: 10, maxWidth: 800 }}>{about.mission}</h2>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal>
            <div className="media-stack">
              <div className="frame" style={{ aspectRatio: '4/4.4' }}><img src={founder.photo} alt={founder.name} /></div>
              <div className="badge"><b>“Firdaus”</b><small>Name given by the Offei-Yaw community</small></div>
            </div>
          </Reveal>
          <div>
            <SectionHead kicker={founder.role} title={founder.name} />
            <div className="prose">
              {founder.bio.map((para, i) => (
                <Reveal key={i} delay={i * 0.05}><p>{para}</p></Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="“When we allow children to explore, imagine, and create, we open the door to lifelong learning.”"
        text="Support the Foundation's work in health, education and empowerment."
        button="Support Our Cause"
        to="/donate"
      />
    </>
  )
}
