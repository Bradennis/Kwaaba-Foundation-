import { PageBanner } from '../components/sections.jsx'
import { SectionHead, Reveal } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'

function extractYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

function isFacebookUrl(url) {
  return url && /facebook\.com/.test(url)
}

function getYear(video) {
  return video.year || '2026'
}

function VideoCell({ video, index }) {
  const ytId = extractYouTubeId(video.url)
  const fbThumb = video.thumbnail && isFacebookUrl(video.url) ? video.thumbnail : null

  return (
    <Reveal delay={Math.min(0.04 * index, 0.3)}>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column' }}>
        <a href={video.url} target="_blank" rel="noreferrer" style={{ display: 'block', position: 'relative', paddingBottom: '56.25%', background: '#000', textDecoration: 'none' }}>
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : fbThumb ? (
            <>
              <img src={fbThumb} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.25)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'grid', placeItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877f2"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 14 }}>
              Watch on {isFacebookUrl(video.url) ? 'Facebook' : 'link'}
            </div>
          )}
        </a>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: 13, lineHeight: 1.35, color: 'var(--dark)' }}>
            {video.title}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Videos() {
  const { content } = useContent()
  const videos = content?.videos || []

  // Group by year, newest first
  const groups = {}
  for (const video of videos) {
    const year = getYear(video)
    if (!groups[year]) groups[year] = []
    groups[year].push(video)
  }
  const sortedYears = Object.keys(groups).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <PageBanner
        title="Videos"
        text="Campaign films, project highlights and event documentation."
        image="/images/donation-app.jpg"
        crumbs={[{ label: 'Resources' }, { label: 'Videos' }]}
      />

      {videos.length > 0 ? (
        <section className="section section--soft">
          <div className="container">
            <SectionHead kicker="Video Library" title="Watch Our" em="Impact" lead="Explore our collection of campaign films and event highlights." />

            {sortedYears.map((year) => (
              <div key={year} style={{ marginTop: 64 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--orange)', marginBottom: 24, paddingBottom: 10, borderBottom: '3px solid var(--orange)' }}>
                  {year}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                  {groups[year].map((video, i) => (
                    <VideoCell key={video.id} video={video} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section section--soft">
          <div className="container">
            <SectionHead kicker="Video Library" title="Watch Our" em="Impact" lead="Watch campaign films and event highlights on our YouTube channel." />
            <Reveal delay={0.1}>
              <div className="admin-card" style={{ marginTop: 44, display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem' }}>No videos yet</h3>
                  <p style={{ color: 'var(--grey)', fontSize: 13, marginTop: 2 }}>
                    Visit our YouTube channel or add videos via the admin panel.
                  </p>
                </div>
                <a className="btn btn--blue btn--sm" href={content.settings?.youtube || 'https://www.youtube.com/channel/UCII7B4sptGUaJyMFTwObBhw'} target="_blank" rel="noreferrer">YouTube</a>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}