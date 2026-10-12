import { PageBanner, PersonCard } from '../components/sections.jsx'
import { SectionHead, Reveal } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'

export default function People({ kind }) {
  const { content } = useContent()
  const isBoard = kind === 'board'
  const people = isBoard ? content.board : content.team
  return (
    <>
      <PageBanner
        title={isBoard ? 'Board of Directors' : 'Our Team'}
        text={isBoard
          ? 'The people who guide Kwaaba Foundation’s strategy, governance and partnerships.'
          : 'Staff, operational support and the project assistant interns who keep our programs moving.'}
        image={isBoard ? '/images/wa-0880.jpg' : '/images/edu-0686.jpg'}
        crumbs={[{ label: 'Who We Are' }, { label: isBoard ? 'Board of Directors' : 'Our Team' }]}
      />
      <section className="section">
        <div className="container">
          <SectionHead
            center
            kicker={isBoard ? 'Governance' : 'People'}
            title={isBoard ? 'Board of' : 'The Team Behind'} em={isBoard ? 'Directors' : 'Kwaaba'}
            lead={isBoard
              ? undefined
              : 'Our greatest asset is our people. We invest in continuous learning and cross-functional collaboration — from Ashesi MasterCard Scholars to seasoned operational staff.'}
          />
          <div className={isBoard ? 'cards' : 'cards cards--4'} style={{ marginTop: 54 }}>
            {people.map((p, i) => <PersonCard key={p.id} person={p} index={i} />)}
          </div>

          {isBoard && (
            <div style={{ marginTop: 56, display: 'grid', gap: 30 }}>
              {people.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <div style={{ background: 'var(--bg-soft)', borderRadius: 10, padding: 30 }}>
                    <h3 style={{ marginBottom: 10 }}>{p.name} <span style={{ color: 'var(--orange)', fontSize: 14 }}>— {p.role}</span></h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>{p.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
