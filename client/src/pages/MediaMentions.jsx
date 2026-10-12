import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageBanner } from '../components/sections.jsx'
import { SectionHead, StaggerGroup, StaggerItem } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'

export default function MediaMentions() {
  const { content } = useContent()
  const mentions = content.posts.filter((p) => p.type === 'media')
  
  const itemsPerPage = 9
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(mentions.length / itemsPerPage)
  const paginatedMentions = mentions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <PageBanner
        title="Media Mentions"
        text="Stories picked up by the press from our campaigns and projects."
        image="/images/green-2500.jpg"
        bgPosition="center 85%"
        crumbs={[{ label: 'Resources' }, { label: 'Media Mentions' }]}
      />

      <section className="section section--soft">
        <div className="container">
          <SectionHead kicker="Press" title="Media" em="Mentions" lead="Stories picked up by the press from our campaigns and projects." />
          
          {mentions.length > 0 ? (
            <>
              <StaggerGroup className="cards" style={{ marginTop: 44 }}>
                {paginatedMentions.map((m) => (
                  <StaggerItem key={m.id}>
                    <article className="card">
                      <div className="card-media" style={{ height: 200 }}>
                        <img src={m.image} alt={m.title} loading="lazy" />
                      </div>
                      <div className="card-body">
                        <span style={{ fontSize: 12, color: 'var(--grey)' }}>
                          {new Date(m.date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{m.title}</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{m.excerpt}</p>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 44, alignItems: 'center' }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid var(--blue)',
                      background: currentPage === 1 ? 'var(--grey-light)' : 'transparent',
                      color: currentPage === 1 ? 'var(--grey)' : 'var(--blue)',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      borderRadius: 6,
                      fontFamily: 'var(--font-head)',
                      fontWeight: 500,
                    }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '10px 14px',
                        border: currentPage === page ? '2px solid var(--blue)' : '1px solid var(--grey-light)',
                        background: currentPage === page ? 'var(--blue)' : 'transparent',
                        color: currentPage === page ? '#fff' : 'var(--navy)',
                        cursor: 'pointer',
                        borderRadius: 6,
                        fontFamily: 'var(--font-head)',
                        fontWeight: currentPage === page ? 600 : 400,
                        minWidth: 44,
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid var(--blue)',
                      background: currentPage === totalPages ? 'var(--grey-light)' : 'transparent',
                      color: currentPage === totalPages ? 'var(--grey)' : 'var(--blue)',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      borderRadius: 6,
                      fontFamily: 'var(--font-head)',
                      fontWeight: 500,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--grey)', marginTop: 44 }}>No media mentions yet.</p>
          )}
        </div>
      </section>
    </>
  )
}