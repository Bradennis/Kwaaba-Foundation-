import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { PageBanner } from '../components/sections.jsx'
import { StaggerGroup, StaggerItem } from '../components/ui.jsx'
import { useContent } from '../cms/ContentContext.jsx'

function getImgUrl(obj, fallback) {
  if (!obj) return fallback || '/images/event-63.jpg'
  if (typeof obj === 'string') return obj
  if (obj.secure_url) return obj.secure_url
  if (obj.url) return obj.url
  if (obj.path) return obj.path
  if (obj.asset?._ref) return null
  return fallback || '/images/event-63.jpg'
}

export default function Gallery() {
  const { albumSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { content } = useContent()
  const [view, setView] = useState(albumSlug ? 'album' : 'albums')
  const [albums, setAlbums] = useState(content?.photoAlbums || [])
  const [photos, setPhotos] = useState([])
  const [currentAlbum, setCurrentAlbum] = useState(null)
  const [openPhoto, setOpenPhoto] = useState(null)

  useEffect(() => {
    if (albumSlug && view === 'albums') setView('album')
  }, [albumSlug])

  useEffect(() => {
    if (albumSlug && view === 'album') {
      loadAlbum(albumSlug)
    }
  }, [albumSlug, view])

  useEffect(() => {
    if (content?.photoAlbums?.length) setAlbums(content.photoAlbums)
  }, [content?.photoAlbums])

  useEffect(() => {
    if (albumSlug && view === 'album' && content?.photoAlbums?.length) {
      loadAlbum(albumSlug)
    }
  }, [content, view])

  async function loadAlbum(slug) {
    try {
      const found = content?.photoAlbums?.find((a) => a.slug === slug || a.slug?.current === slug || a.id === slug)
      if (found) {
        setCurrentAlbum(found)
        const albumPhotos = found?.photos || []
        const linkedPhotos = (content?.photos || []).filter((p) => p.albumId === found.id)
        setPhotos(albumPhotos.length > 0 ? albumPhotos : linkedPhotos)
      }
    } catch {
      const found = content?.photoAlbums?.find((a) => a.slug === slug || a.slug?.current === slug || a.id === slug)
      if (found) {
        setCurrentAlbum(found)
        const albumPhotos = found?.photos || []
        const linkedPhotos = (content?.photos || []).filter((p) => p.albumId === found.id)
        setPhotos(albumPhotos.length > 0 ? albumPhotos : linkedPhotos)
      }
    }
  }

  function goToAlbums() {
    const params = new URLSearchParams(location.search)
    params.delete('album')
    params.delete('album_ses')
    navigate(`/gallery?${params.toString()}`)
    setView('albums')
    setCurrentAlbum(null)
    setPhotos([])
  }

  function albumThumbUrl(a) {
    if (a?.thumbnailUrl) return a.thumbnailUrl
    if (a?.thumbnail) return getImgUrl(a.thumbnail)
    if (a?.thumbnail?.url) return a.thumbnail.url
    return null
  }

  function albumThumbFallback(a) {
    return a?.thumbnail || a?.image || '/images/event-63.jpg'
  }

  const crumbs = currentAlbum
    ? [
        { label: 'Resources', to: '/resources' },
        { label: 'Photos', to: '/gallery' },
        { label: currentAlbum.title },
      ]
    : [
        { label: 'Resources', to: '/resources' },
        { label: 'Photos' },
      ]

  return (
    <>
      <PageBanner
        title="Photos"
        text="Moments from blood drives, tree plantings, classroom visits and community days."
        image="/images/event-76.jpg"
        crumbs={crumbs}
      />

      {view === 'albums' ? (
        <section className="section">
          <div className="container">
            <StaggerGroup className="album-grid">
              {albums.map((a, i) => {
                const albumPhotoCount = (content?.photos || []).filter((p) => p.albumId === a.id).length
                return (
                <StaggerItem key={a.id || a._id || i}>
                  <div
                    className="album-card"
                    onClick={() => {
                      const slug = a.slug?.current || a.slug || a.id
                      navigate(`/gallery/${slug}`)
                    }}
                  >
                    <div className="album-thumb">
                      {albumThumbUrl(a) ? (
                        <img src={albumThumbUrl(a)} alt={a.title} loading="lazy" />
                      ) : (
                        <img src={albumThumbFallback(a)} alt={a.title} loading="lazy" />
                      )}
                      <div className="album-count">{albumPhotoCount} Photos</div>
                    </div>
                    <div className="album-info">
                      <h3>{a.title}</h3>
                      {a.date && <span className="album-date">{new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                      {a.description && <p className="album-desc">{a.description}</p>}
                    </div>
                  </div>
                </StaggerItem>
                )
              })}
              {albums.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--grey)' }}>
                  <p>No photo albums yet. Add albums via the CMS.</p>
                </div>
              )}
            </StaggerGroup>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container">
            <nav className="album-breadcrumb">
              <a href="/gallery" onClick={(e) => { e.preventDefault(); goToAlbums(); }}>
                Main Album
              </a>
              <span className="breadcrumb-sep">»</span>
              <span>{currentAlbum?.title}</span>
            </nav>

            {currentAlbum && photos.length > 0 ? (
              <div className="album-photo-grid">
                {photos.map((p, i) => (
                  <div key={p.id || p._id || i} className="album-photo-item" onClick={() => setOpenPhoto(p)}>
                    <img
                      src={p.thumbnailUrl || p.imageUrl || getImgUrl(p.image, '/images/event-63.jpg')}
                      alt={p.caption || p.title}
                      loading="lazy"
                    />
                    {(p.caption || p.title) && <div className="cap">{p.caption || p.title}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--grey)' }}>
                <p>No photos in this album yet.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <AnimatePresence>
        {openPhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPhoto(null)}
          >
            <motion.img
              src={openPhoto.imageUrl || openPhoto.image?.url || (typeof openPhoto.image === 'string' ? openPhoto.image : null) || '/images/event-63.jpg'}
              alt={openPhoto.caption || openPhoto.title}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setOpenPhoto(null)} aria-label="Close"><FiX /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}