import { useState } from 'react'
import { PageBanner } from '../components/sections.jsx'
import { SectionHead, Reveal, StaggerGroup, StaggerItem } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiHeart, FiUsers, FiZap, FiGift, FiCheckCircle } from 'react-icons/fi'

function Toast({ msg }) {
  return <div className="toast">{msg}</div>
}

export default function GetInvolved({ mode }) {
  const { content } = useContent()
  const s = content.settings
  const [sent, setSent] = useState(false)
  const isDonate = mode === 'donate'

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4200)
    e.target.reset()
  }

  return (
    <>
      <PageBanner
        title={isDonate ? 'Financial Donations' : 'Volunteer Opportunities'}
        text={isDonate
          ? 'Your support funds blood drives, seedlings, boreholes, screenings and classrooms across Ghana.'
          : 'Kwaaba welcomes volunteers in the execution of its various programs — a very rewarding experience, again and again.'}
        image={isDonate ? '/images/blood-157.jpg' : '/images/wa-0880.jpg'}
        crumbs={[{ label: 'Support Our Cause' }, { label: isDonate ? 'Financial Donations' : 'Volunteer Opportunities' }]}
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead
              kicker={isDonate ? 'Support Our Cause' : 'Join Us'}
              title={isDonate ? 'Every Drop' : 'Give Time,'} em={isDonate ? 'Counts' : 'Change Lives'}
            />
            {isDonate ? (
              <div className="prose">
                <p>A few minutes of your time and a single pint of blood can give someone a lifetime. Money too moves the needle: 500+ seedlings planted, a borehole built for Offei Yaw, an eight-seater Biofil toilet, health screenings, school supplies.</p>
                <blockquote>Give Life, Plant Hope. Join the Giving Cycle!</blockquote>
                <p>Kwaaba Foundation is registered as Dua Pa Foundation in the USA with IRS 501(c)(3) tax-exempt status, and can participate in corporate matching programs.</p>
              </div>
            ) : (
              <div className="prose">
                <p>Those that have volunteered in the past have found it a very rewarding experience, and have volunteered again and again. The Foundation has relationships with some schools — students can volunteer for credit hours. There are other volunteer opportunities for a day, weekend or ongoing.</p>
                <p>We welcome your ideas on other ways you can support the cause. Please call {s.phoneShort} or email {s.email}.</p>
              </div>
            )}

            <StaggerGroup className="cards" style={{ marginTop: 30, gridTemplateColumns: '1fr 1fr' }}>
              {(isDonate
                ? [
                    { ico: FiHeart, t: 'Fund a Blood Drive', d: 'Sponsor kits, seedlings and logistics for one donor session.' },
                    { ico: FiGift, t: 'Give In-Kind', d: 'School supplies, books, seedlings — or your company products.' },
                    { ico: FiZap, t: 'Corporate Matching', d: 'US donors can give through corporate matching (501(c)(3)).' },
                    { ico: FiUsers, t: 'Become a Partner', d: 'Organizations and schools — co-create a campaign with us.' },
                  ]
                : [
                    { ico: FiUsers, t: 'Event Volunteering', d: 'A day or weekend supporting blood drives and walks.' },
                    { ico: FiZap, t: 'Ongoing Roles', d: 'Design, data, photography, logistics — sustained support.' },
                    { ico: FiHeart, t: 'Internships', d: 'Credit-hour placements with partner schools, like our Ashesi interns.' },
                    { ico: FiGift, t: 'Skills-Based', d: 'Mentorship, tutoring and professional services.' },
                  ]
              ).map((c, i) => (
                <StaggerItem key={c.t}>
                  <div className="admin-card" style={{ height: '100%', margin: 0 }}>
                    <span style={{ color: 'var(--orange)', fontSize: 24 }}><c.ico /></span>
                    <h3 style={{ fontSize: '1.05rem', margin: '12px 0 6px' }}>{c.t}</h3>
                    <p style={{ color: 'var(--grey)', fontSize: 14, lineHeight: 1.7 }}>{c.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <Reveal delay={0.15}>
            <form className="admin-card" onSubmit={submit} style={{ position: 'sticky', top: 110 }}>
              <h3 style={{ marginBottom: 6 }}>{isDonate ? 'Pledge a Donation' : 'Volunteer Application'}</h3>
              <p style={{ color: 'var(--grey)', fontSize: 14, marginBottom: 20 }}>
                {isDonate
                  ? 'Tell us how you would like to support and we will share payment details.'
                  : 'Tell us a little about yourself and where you would like to help.'}
              </p>
              <div className="form-grid">
                <div className="field full"><label>Full name</label><input required placeholder="Kofi Mensah" /></div>
                <div className="field"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
                <div className="field"><label>Phone</label><input placeholder="+233..." /></div>
                {isDonate && (
                  <div className="field full">
                    <label>Amount / frequency</label>
                    <select>
                      <option>One-time gift</option><option>Monthly</option><option>Quarterly</option><option>In-kind donation</option>
                    </select>
                  </div>
                )}
                {!isDonate && (
                  <div className="field full">
                    <label>Availability</label>
                    <select><option>One-off (a day)</option><option>Weekends</option><option>Ongoing</option><option>Credit-hour internship</option></select>
                  </div>
                )}
                <div className="field full"><label>Message</label><textarea rows={4} placeholder="How would you like to help?" /></div>
                <div className="full"><button className="btn btn--orange" style={{ width: '100%', justifyContent: 'center' }}>{isDonate ? 'Send Pledge' : 'Apply to Volunteer'}</button></div>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <div className="section--soft" style={{ padding: '46px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
          <FiCheckCircle style={{ color: 'var(--green)', fontSize: 22 }} />
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', color: 'var(--navy)' }}>
            Prefer to reach out directly? Call {s.phone} or email {s.email}
          </span>
        </div>
      </div>

      {sent && <Toast msg="Thank you! Your message has been noted. We will be in touch shortly." />}
    </>
  )
}
