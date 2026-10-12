import { Link } from 'react-router-dom'
import { PageBanner } from '../components/sections.jsx'
import { SectionHead, Reveal } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'
import { FiDownload, FiFileText } from 'react-icons/fi'

export default function Newsletters() {
  const { content } = useContent()
  const newsletters = content.newsletters || []
  
  const specialItems = newsletters.filter(n => 
    n.title.toLowerCase().includes('curated resource guide') || 
    n.title.toLowerCase().includes('projects documentation')
  )
  
  const quarterlyItems = newsletters.filter(n => 
    !n.title.toLowerCase().includes('curated resource guide') && 
    !n.title.toLowerCase().includes('projects documentation')
  )
  
  const years = [...new Set(quarterlyItems.map((n) => n.year))].sort((a, b) => b - a)
  
  return (
    <>
      <PageBanner
        title="Newsletters"
        text="Dua Pa Quarterly newsletters — curated resource guides and updates from the field."
        image="/images/edu-0110.jpg"
        crumbs={[{ label: 'Resources' }, { label: 'Newsletters' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHead kicker="Quarterly Updates" title="Dua Pa Quarterly" em="Newsletters" lead="Curated resource guides and quarterly updates from the field." />

          {/* Special Items */}
          {specialItems.length > 0 && (
            <div style={{ marginTop: 44, display: 'grid', gap: 16 }}>
              {specialItems.map((item) => (
                <Reveal key={item.id}>
                  <a
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                    style={{
                      padding: 24,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                      background: 'var(--blue-light)',
                    }}
                  >
                    <span className="card-icon" style={{ margin: 0, fontSize: 24 }}>
                      {item.title.toLowerCase().includes('curated') ? <FiFileText /> : <FiDownload />}
                    </span>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--navy)', fontSize: '1.1rem' }}>
                      {item.title}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          )}

          {/* Year-Grouped Quarterly Newsletters */}
          {years.length > 0 && (
            <div style={{ marginTop: 64, display: 'grid', gap: 48 }}>
              {years.map((y) => (
                <Reveal key={y}>
                  <div>
                    <h3 style={{ marginBottom: 20, color: 'var(--blue)', fontSize: '1.5rem', fontWeight: 600 }}>
                      {y} Newsletters
                    </h3>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {quarterlyItems
                        .filter((n) => n.year === y)
                        .map((n) => (
                          <a
                            key={n.id}
                            href={n.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card"
                            style={{
                              padding: 18,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 14,
                            }}
                          >
                            <span className="card-icon" style={{ margin: 0 }}>
                              <FiDownload />
                            </span>
                            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 500, color: 'var(--navy)' }}>
                              {n.title}
                            </span>
                          </a>
                        ))}
                    </div>
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