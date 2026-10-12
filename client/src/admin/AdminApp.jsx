import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiGrid, FiEdit2, FiTrash2, FiPlus, FiChevronUp, FiChevronDown,
  FiExternalLink, FiLogOut, FiSave, FiRotateCcw, FiLock, FiUpload, FiX,
} from 'react-icons/fi'
import { useContent, useAuth } from '../cms/ContentContext.jsx'
import { SCHEMA, SETTINGS_FIELDS } from './schema.js'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || ''

/* ---------------- login ---------------- */
function Login() {
  const { login } = useAuth()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <div className="admin-login">
      <form className="box" onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        const ok = await login(pw)
        if (!ok) setErr(true)
        setLoading(false)
      }}>
        <img src="/images/kwaaba_logo.png" alt="Kwaaba Foundation" style={{ height: 56, marginBottom: 18 }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Admin Login</h2>
        <p style={{ color: 'var(--grey)', fontSize: 14, marginBottom: 22 }}>Manage your website content.</p>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(false) }} placeholder="••••••••" autoFocus />
        </div>
        {err && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>Wrong password. Try again.</p>}
        <button className="btn btn--orange" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          <FiLock /> {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ color: 'var(--grey)', fontSize: 12, marginTop: 16 }}>Demo password: <b>kwaaba2026</b></p>
      </form>
    </div>
  )
}

/* ---------------- image upload helper ---------------- */
function ImageUploader({ label, value, onChange }) {
  const { getToken } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)

  useEffect(() => { setPreview(value) }, [value])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const token = getToken()
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Upload failed with status ${res.status}`)
      if (data.success) {
        onChange(data.url)
      } else {
        throw new Error(data.error || 'Upload returned no success flag')
      }
    } catch (err) {
      console.warn('Server upload failed, falling back to base64:', err.message)
      // Fallback: read as base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      onChange(base64)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="field" style={{ marginBottom: 16 }}>
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/... or /images/file.jpg"
          style={{ flex: 1, minWidth: 200 }}
        />
        <label className="btn btn--sm btn--outline" style={{ cursor: 'pointer' }}>
          <FiUpload /> {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>
      {preview && (
        <img src={preview} alt="Preview" style={{ maxWidth: 120, marginTop: 8, borderRadius: 4, border: '1px solid #ddd' }} />
      )}
    </div>
  )
}

/* ---------------- generic collection CRUD ---------------- */
function CollectionManager({ collection }) {
  const conf = SCHEMA[collection]
  const { content, addItem, updateItem, removeItem, moveItem } = useContent()
  const rows = content[collection] || []
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(conf.blank)
  const [confirmDel, setConfirmDel] = useState(null)
  const [saving, setSaving] = useState(false)

  const openNew = () => { setForm(conf.blank); setEditing('new') }
  const openEdit = (it) => {
    const f = {}
    conf.keys.forEach((k) => { f[k] = it[k] ?? '' })
    setForm(f)
    setEditing(it.id)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing === 'new') {
        const id = await addItem(collection, form)
        await persistToServer(collection, { ...form, id })
      } else {
        await updateItem(collection, editing, form)
        await persistToServer(collection, { ...form, id: editing })
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    removeItem(collection, id)
    await deleteFromServer(collection, id)
    setConfirmDel(null)
  }

  const handleMove = async (id, dir) => {
    moveItem(collection, id, dir)
    await reorderCollection(collection)
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>{conf.icon} {conf.label}</h2>
          <p style={{ color: 'var(--grey)', fontSize: 14 }}>{rows.length} item{rows.length !== 1 && 's'} — changes sync to the server.</p>
        </div>
        {collection !== 'photos' && <button className="btn btn--orange btn--sm" onClick={openNew}><FiPlus /> Add New</button>}
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              {conf.preview && conf.preview !== 'image' && conf.preview !== 'photo' && conf.preview !== 'thumbnail' && <th>Preview</th>}
              <th>{conf.titleKey}</th>
              <th style={{ width: 170 }}>Order / Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it, i) => (
              <tr key={it.id}>
                {(conf.preview && (conf.preview === 'image' || conf.preview === 'photo' || conf.preview === 'thumbnail')) && (
                  <td>{String(it[conf.preview]).startsWith('/') || String(it[conf.preview]).startsWith('http')
                    ? <img className="thumb" src={it[conf.preview]} alt="" />
                    : <span style={{ color: 'var(--grey)' }}>—</span>}</td>
                )}
                {conf.preview && conf.preview === 'src' && (
                  <td>{String(it.src).startsWith('/') || String(it.src).startsWith('http')
                    ? <img className="thumb" src={it.src} alt="" />
                    : <span style={{ color: 'var(--grey)' }}>—</span>}</td>
                )}
                <td>
                  <b>{it[conf.titleKey] || '(untitled)'}</b>
                  {it.status && <span className={`chip ${it.status === 'upcoming' ? 'green' : 'blue'}`} style={{ marginLeft: 8 }}>{it.status}</span>}
                  {it.type && <span className={`chip ${it.type === 'news' ? 'orange' : 'bronze'}`} style={{ marginLeft: 8 }}>{it.type}</span>}
                  {it.albumId && <span className="chip" style={{ marginLeft: 8 }}>{it.albumId}</span>}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" disabled={i === 0} onClick={() => handleMove(it.id, -1)} title="Move up"><FiChevronUp /></button>
                    <button className="icon-btn" disabled={i === rows.length - 1} onClick={() => handleMove(it.id, 1)} title="Move down"><FiChevronDown /></button>
                    <button className="icon-btn" onClick={() => openEdit(it)} title="Edit"><FiEdit2 /></button>
                    <button className="icon-btn danger" onClick={() => setConfirmDel(it.id)} title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--grey)', padding: 30 }}>No items yet — add your first one.</td></tr>}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(8,31,54,.6)', display: 'grid', placeItems: 'center', padding: 20 }}
            onClick={(e) => e.target === e.currentTarget && setEditing(null)}
          >
            <motion.form
              className="admin-card"
              style={{ width: 'min(680px, 100%)', maxHeight: '88vh', overflowY: 'auto', margin: 0 }}
              onSubmit={save}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            >
              <h3 style={{ marginBottom: 18 }}>{editing === 'new' ? 'Add' : 'Edit'} {conf.label.replace(/s$/, '') || 'item'}</h3>
              {conf.fields.map((f, idx) => {
                const key = conf.keys[idx]
                if (f.image) {
                  return (
                    <ImageUploader
                      key={key}
                      label={f.label}
                      value={form[key] || ''}
                      onChange={(val) => setForm({ ...form, [key]: val })}
                    />
                  )
                }
                return (
                  <div className="field" key={key} style={{ marginBottom: 16 }}>
                    <label>{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea rows={f.rows || 4} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                    ) : f.type === 'select' ? (
                      <select value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                        value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />
                    )}
                    {f.hint && <small style={{ color: 'var(--grey)', fontSize: 12 }}>{f.hint}</small>}
                  </div>
                )
              })}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn--blue btn--sm" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDel && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(8,31,54,.6)', display: 'grid', placeItems: 'center' }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDel(null)}>
            <div className="admin-card" style={{ width: 380, margin: 0, textAlign: 'center' }}>
              <h3>Delete this item?</h3>
              <p style={{ color: 'var(--grey)', margin: '10px 0 20px', fontSize: 14 }}>This will be permanently removed from the server.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn--outline btn--sm" onClick={() => setConfirmDel(null)}>Keep</button>
                <button className="btn btn--sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(confirmDel)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------------- photo album editor (custom) ---------------- */
function PhotoAlbumManager() {
  const { content, addItem, updateItem, removeItem, moveItem } = useContent()
  const { getToken } = useAuth()
  const albums = content.photoAlbums || []
  const allPhotos = content.photos || []
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', slug: '', date: new Date().toISOString().slice(0, 10), thumbnail: '', description: '', photos: [] })
  const [confirmDel, setConfirmDel] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  const openNew = () => {
    setForm({ title: '', slug: '', date: new Date().toISOString().slice(0, 10), thumbnail: '/images/event-63.jpg', description: '', photos: [] })
    setEditing('new')
  }

  const openEdit = (it) => {
    const albumPhotos = (content.photos || []).filter((p) => p.albumId === it.id)
    setForm({
      title: it.title || '',
      slug: it.slug || '',
      date: it.date || new Date().toISOString().slice(0, 10),
      thumbnail: it.thumbnail || '/images/event-63.jpg',
      description: it.description || '',
      photos: albumPhotos.map((p, i) => ({ caption: p.caption || '', image: p.image || '/images/event-63.jpg', order: i })),
    })
    setEditing(it.id)
  }

  const addPhoto = () => {
    setForm({ ...form, photos: [...form.photos, { caption: '', image: '/images/event-63.jpg', order: form.photos.length }] })
  }

  const handleBulkUpload = async (files) => {
    const hasServer = Boolean(SERVER_URL)
    const newPhotos = []
    const total = files.length

    for (let i = 0; i < total; i++) {
      setUploadProgress({ current: i, total, name: files[i].name })

      let url = null
      if (hasServer) {
        try {
          console.log('Uploading via server:', files[i].name)
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 10000)
          const formData = new FormData()
          formData.append('image', files[i])
          const res = await fetch(`${SERVER_URL}/api/upload`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          })
          clearTimeout(timeout)
          console.log('Server response:', res.status)
          const data = await res.json()
          if (data.success && data.url) {
            console.log('Server upload OK:', data.url)
            url = data.url
          } else {
            console.warn('Server upload no URL:', data)
          }
        } catch (err) {
          console.warn('Server upload failed:', files[i].name, err.message)
        }
      }

      if (!url) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(files[i])
        })
        url = base64
      }

      newPhotos.push({
        caption: '',
        image: url,
        order: form.photos.length + newPhotos.length,
      })
    }

    setUploadProgress(null)
    if (newPhotos.length > 0) {
      setForm({ ...form, photos: [...form.photos, ...newPhotos] })
    } else if (total > 0) {
      alert('Failed to process all selected photos.')
    }
  }

  const removePhoto = (idx) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== idx) })
  }

  const updatePhoto = (idx, key, val) => {
    const updated = [...form.photos]
    updated[idx] = { ...updated[idx], [key]: val }
    setForm({ ...form, photos: updated })
  }

  const movePhoto = (idx, dir) => {
    const j = idx + dir
    if (j < 0 || j >= form.photos.length) return
    const updated = [...form.photos]
    ;[updated[idx], updated[j]] = [updated[j], updated[idx]]
    updated.forEach((p, i) => (p.order = i))
    setForm({ ...form, photos: updated })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing === 'new') {
        const id = 'pa' + Date.now().toString(36)
        let slug = form.slug?.trim()
        if (!slug) {
          slug = (form.title || 'album')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        const album = { ...form, id, slug }
        await addItem('photoAlbums', album)
        await persistToServer('photoAlbums', album)
        // save photos linked to this album
        for (const p of form.photos) {
          const photo = { caption: p.caption, image: p.image, albumId: id }
          await addItem('photos', photo)
          await persistToServer('photos', photo)
        }
      } else {
        await updateItem('photoAlbums', editing, form)
        await persistToServer('photoAlbums', { ...form, id: editing })

        // get current photos for this album (fresh from state)
        const currentAlbumPhotos = allPhotos.filter((p) => p.albumId === editing)
        const currentByImage = new Map(currentAlbumPhotos.map((p) => [p.image, p]))

        // update or add photos from form
        for (const p of form.photos) {
          const existing = currentByImage.get(p.image)
          if (existing) {
            await updateItem('photos', existing.id, { caption: p.caption })
            await persistToServer('photos', { ...existing, caption: p.caption })
          } else {
            const photo = { caption: p.caption, image: p.image, albumId: editing }
            await addItem('photos', photo)
            await persistToServer('photos', photo)
          }
        }

        // delete photos that were in album but removed from form
        const formImages = new Set(form.photos.map((p) => p.image))
        for (const p of currentAlbumPhotos) {
          if (!formImages.has(p.image)) {
            removeItem('photos', p.id)
            await deleteFromServer('photos', p.id)
          }
        }
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    // delete photos first using latest from context
    for (const p of (content.photos || [])) {
      if (p.albumId === id) {
        removeItem('photos', p.id)
        await deleteFromServer('photos', p.id)
      }
    }
    removeItem('photoAlbums', id)
    await deleteFromServer('photoAlbums', id)
    setConfirmDel(null)
  }

  const handleMove = async (id, dir) => {
    moveItem('photoAlbums', id, dir)
    await reorderCollection('photoAlbums')
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>📁 Photo Albums</h2>
          <p style={{ color: 'var(--grey)', fontSize: 14 }}>{albums.length} album{albums.length !== 1 && 's'} — edit albums and their photos here.</p>
        </div>
        <button className="btn btn--orange btn--sm" onClick={openNew}><FiPlus /> Add New Album</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th style={{ width: 170 }}>Order / Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((it, i) => {
              const photoCount = allPhotos.filter((p) => p.albumId === it.id).length
              return (
                <tr key={it.id}>
                  <td>{String(it.thumbnail).startsWith('/') || String(it.thumbnail).startsWith('http')
                    ? <img className="thumb" src={it.thumbnail} alt="" />
                    : <span style={{ color: 'var(--grey)' }}>—</span>}</td>
                  <td>
                    <b>{it.title || '(untitled)'}</b>
                    <br />
                    <span style={{ fontSize: 12, color: 'var(--grey)' }}>{photoCount} photo{photoCount !== 1 && 's'}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" disabled={i === 0} onClick={() => handleMove(it.id, -1)} title="Move up"><FiChevronUp /></button>
                      <button className="icon-btn" disabled={i === albums.length - 1} onClick={() => handleMove(it.id, 1)} title="Move down"><FiChevronDown /></button>
                      <button className="icon-btn" onClick={() => openEdit(it)} title="Edit"><FiEdit2 /></button>
                      <button className="icon-btn danger" onClick={() => setConfirmDel(it.id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {albums.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--grey)', padding: 30 }}>No albums yet — create your first one.</td></tr>}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(8,31,54,.6)', display: 'grid', placeItems: 'center', padding: 20 }}
            onClick={(e) => e.target === e.currentTarget && setEditing(null)}
          >
            <motion.form
              className="admin-card"
              style={{ width: 'min(750px, 100%)', maxHeight: '88vh', overflowY: 'auto', margin: 0 }}
              onSubmit={save}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            >
              <h3 style={{ marginBottom: 18 }}>{editing === 'new' ? 'New' : 'Edit'} Photo Album</h3>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Album Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Slug (url)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. march-2025-blood-drive" />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Event Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>

              <ImageUploader label="Album Thumbnail" value={form.thumbnail} onChange={(val) => setForm({ ...form, thumbnail: val })} />

              <div className="field" style={{ marginBottom: 16 }}>
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ fontSize: 15, fontWeight: 600 }}>Photos ({form.photos.length})</label>
                  <label className="btn btn--outline btn--sm" style={{ cursor: uploadProgress ? 'wait' : 'pointer', opacity: uploadProgress ? 0.6 : 1 }}>
                    <FiUpload /> {uploadProgress ? `Uploading ${uploadProgress.current + 1}/${uploadProgress.total}...` : 'Add Photos'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={!!uploadProgress}
                      onChange={(e) => {
                        if (e.target.files?.length && !uploadProgress) {
                          handleBulkUpload(Array.from(e.target.files))
                          e.target.value = ''
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {uploadProgress && (
                  <div className="admin-card" style={{ padding: 14, marginBottom: 12, border: '2px solid var(--orange)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span>Uploading: {uploadProgress.name}</span>
                      <span>{uploadProgress.current + 1} / {uploadProgress.total}</span>
                    </div>
                    <div style={{ background: 'var(--light)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${((uploadProgress.current + 1) / uploadProgress.total) * 100}%`, background: 'var(--orange)', height: '100%', borderRadius: 6, transition: 'width 0.2s' }} />
                    </div>
                  </div>
                )}

                {form.photos.map((p, i) => (
                  <div key={i} className="admin-card" style={{ marginBottom: 12, padding: 14 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ width: 80, height: 60, flexShrink: 0 }}>
                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div className="field" style={{ marginBottom: 8 }}>
                          <label>Caption</label>
                          <input value={p.caption} onChange={(e) => updatePhoto(i, 'caption', e.target.value)} />
                        </div>
                        <div className="field" style={{ marginBottom: 0 }}>
                          <label>Image</label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              type="text"
                              value={p.image}
                              onChange={(e) => updatePhoto(i, 'image', e.target.value)}
                              placeholder="/images/... or URL"
                              style={{ flex: 1, minWidth: 120, fontSize: 13 }}
                            />
                            <button type="button" className="icon-btn danger" onClick={() => removePhoto(i)} title="Remove"><FiX /></button>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button type="button" className="icon-btn" onClick={() => movePhoto(i, -1)} title="Move up" style={{ padding: 4 }}><FiChevronUp size={12} /></button>
                        <button type="button" className="icon-btn" onClick={() => movePhoto(i, 1)} title="Move down" style={{ padding: 4 }}><FiChevronDown size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}

                {form.photos.length === 0 && (
                  <p style={{ color: 'var(--grey)', fontSize: 13, textAlign: 'center', padding: 20 }}>No photos yet — click "Add Photo" to upload photos for this album.</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn--blue btn--sm" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save Album'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDel && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(8,31,54,.6)', display: 'grid', placeItems: 'center' }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDel(null)}>
            <div className="admin-card" style={{ width: 380, margin: 0, textAlign: 'center' }}>
              <h3>Delete this album?</h3>
              <p style={{ color: 'var(--grey)', margin: '10px 0 20px', fontSize: 14 }}>This will permanently remove the album and all its photos from the server.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn--outline btn--sm" onClick={() => setConfirmDel(null)}>Keep</button>
                <button className="btn btn--sm" style={{ background: '#dc2626', color: '#fff' }} onClick={() => handleDelete(confirmDel)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------------- server helpers ---------------- */
async function persistToServer(collection, item) {
  const token = typeof window !== 'undefined' && window.sessionStorage?.getItem('kwaaba_admin_auth')
  try {
    await fetch(`${SERVER_URL}/api/collection/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(item),
    })
  } catch (e) {
    console.warn('Failed to persist to server:', e.message)
  }
}

async function deleteFromServer(collection, id) {
  const token = typeof window !== 'undefined' && window.sessionStorage?.getItem('kwaaba_admin_auth')
  try {
    await fetch(`${SERVER_URL}/api/collection/${collection}/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch (e) {
    console.warn('Failed to delete from server:', e.message)
  }
}

async function reorderCollection(collection) {
  const token = typeof window !== 'undefined' && window.sessionStorage?.getItem('kwaaba_admin_auth')
  try {
    await fetch(`${SERVER_URL}/api/collection/${collection}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: [] }),
    })
  } catch (e) {
    console.warn('Reorder warning:', e.message)
  }
}

/* ---------------- settings editors ---------------- */
function SettingsPage() {
  const { content, updateSettings } = useContent()
  const [form, setForm] = useState(content.settings)
  const [saved, setSaved] = useState(false)
  return (
    <>
      <div className="admin-head">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>⚙️ Site Settings</h2>
          <p style={{ color: 'var(--grey)', fontSize: 14 }}>Contact details, socials and labels used across the site.</p>
        </div>
      </div>
      <form className="admin-card" onSubmit={(e) => { e.preventDefault(); updateSettings(form); setSaved(true); setTimeout(() => setSaved(false), 2500) }}>
        <div className="form-grid">
          {SETTINGS_FIELDS.map((f) => (
            <div className={`field ${f.type === 'textarea' ? 'full' : ''}`} key={f.key}>
              <label>{f.label}</label>
              {f.type === 'textarea'
                ? <textarea rows={3} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                : <input value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
            </div>
          ))}
          <div className="full" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn--blue btn--sm"><FiSave /> Save Settings</button>
            {saved && <span style={{ color: 'var(--green)', fontSize: 14 }}>✓ Saved</span>}
          </div>
        </div>
      </form>
    </>
  )
}

function AboutFounderPage() {
  const { content, updateAbout, updateFounder } = useContent()
  const [about, setAbout] = useState({ ...content.about, body: content.about.body.join('\n\n') })
  const [founder, setFounder] = useState({ ...content.founder, bio: content.founder.bio.join('\n\n') })
  const [saved, setSaved] = useState(false)
  const save = (e) => {
    e.preventDefault()
    updateAbout({ ...about, body: about.body.split(/\n\n+/) })
    updateFounder({ ...founder, bio: founder.bio.split(/\n\n+/) })
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }
  return (
    <>
      <div className="admin-head"><h2 style={{ fontSize: '1.5rem' }}>🏠 About & Founder</h2></div>
      <form onSubmit={save}>
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>About Page</h3>
          <div className="form-grid">
            <div className="field full"><label>Section title</label><input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} /></div>
            <div className="field full"><label>Lead paragraph</label><textarea rows={2} value={about.lead} onChange={(e) => setAbout({ ...about, lead: e.target.value })} /></div>
            <div className="field full"><label>Body paragraphs (separate with a blank line)</label><textarea rows={7} value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} /></div>
            <div className="field"><label>Mission</label><textarea rows={2} value={about.mission} onChange={(e) => setAbout({ ...about, mission: e.target.value })} /></div>
            <div className="field"><label>Image</label><input value={about.image} onChange={(e) => setAbout({ ...about, image: e.target.value })} /></div>
            <div className="field"><label>Small overlapping image</label><input value={about.imageBack} onChange={(e) => setAbout({ ...about, imageBack: e.target.value })} /></div>
          </div>
        </div>
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Founder</h3>
          <div className="form-grid">
            <div className="field"><label>Name</label><input value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} /></div>
            <div className="field"><label>Role</label><input value={founder.role} onChange={(e) => setFounder({ ...founder, role: e.target.value })} /></div>
            <div className="field full"><label>Photo</label><input value={founder.photo} onChange={(e) => setFounder({ ...founder, photo: e.target.value })} /></div>
            <div className="field full"><label>Short bio (homepage)</label><textarea rows={2} value={founder.short} onChange={(e) => setFounder({ ...founder, short: e.target.value })} /></div>
            <div className="field full"><label>Full bio paragraphs (blank-line separated)</label><textarea rows={9} value={founder.bio} onChange={(e) => setFounder({ ...founder, bio: e.target.value })} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn--blue btn--sm"><FiSave /> Save About & Founder</button>
          {saved && <span style={{ color: 'var(--green)', fontSize: 14 }}>✓ Saved</span>}
        </div>
      </form>
    </>
  )
}

/* ---------------- dashboard ---------------- */
function Dashboard() {
  const { content, resetContent } = useContent()
  const [confirm, setConfirm] = useState(false)
  const counts = Object.fromEntries(Object.keys(SCHEMA).map((k) => [k, (content[k] || []).length]))
  return (
    <>
      <div className="admin-head">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Dashboard</h2>
          <p style={{ color: 'var(--grey)', fontSize: 14 }}>Welcome back. Content updates sync to the server.</p>
        </div>
        <Link to="/" className="btn btn--outline btn--sm" target="_blank"><FiExternalLink /> View Site</Link>
      </div>
      <div className="admin-kpis">
        {[
          ['🎞️', counts.slides, 'Hero slides', 'var(--blue)'],
          ['🧩', counts.programs, 'Programs', 'var(--green)'],
          ['📅', (content.events || []).filter((e) => e.status === 'upcoming').length, 'Upcoming events', 'var(--orange)'],
          ['🖼️', counts.gallery, 'Gallery photos', 'var(--bronze)'],
          ['📁', counts.photoAlbums, 'Photo Albums', 'var(--blue)'],
        ].map(([ico, n, label, color]) => (
          <div className="kpi" key={label}>
            <span className="ico" style={{ background: `${color}18`, color }}>{ico}</span>
            <div><b>{n}</b><small>{label}</small></div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Quick edit</h3>
        <p style={{ color: 'var(--grey)', fontSize: 14.5, lineHeight: 1.8 }}>
          Use the sidebar to manage every part of the public site — hero slides, stats, programs, people, events, news, gallery, newsletters and quotes.
          All changes sync to your server database. Images are uploaded to Cloudinary for fast, global delivery.
        </p>
      </div>
      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Content data</h3>
        <p style={{ color: 'var(--grey)', fontSize: 14, marginBottom: 16 }}>Download a JSON snapshot of everything.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn--green btn--sm" onClick={() => {
            const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'kwaaba-content.json'
            a.click()
          }}>Export JSON</button>
        </div>
      </div>
    </>
  )
}

/* ---------------- shell ---------------- */
export default function AdminApp() {
  const { authed, logout } = useAuth()
  if (!authed) return <Login />
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <img src="/images/kwaaba_logo.png" alt="" />
          <div><b>Kwaaba<br /><small style={{ color: 'var(--bronze)', fontWeight: 400 }}>CMS</small></b></div>
        </div>
        <nav>
          <NavLink to="/admin" end>📊 <FiGrid style={{ display: 'none' }} /> Dashboard</NavLink>
          {Object.entries(SCHEMA).filter(([k]) => k !== 'photoAlbums' && k !== 'photos').map(([k, v]) => (
            <NavLink key={k} to={`/admin/${k}`}>{v.icon} {v.label}</NavLink>
          ))}
          <NavLink to="/admin/photoAlbums">📁 Photo Albums</NavLink>
          <NavLink to="/admin/photos" style={{ paddingLeft: 28 }}>📷 All Photos</NavLink>
          <NavLink to="/admin/about">🏠 About & Founder</NavLink>
          <NavLink to="/admin/settings">⚙️ Settings</NavLink>
          <a href="/" target="_blank"><FiExternalLink /> View Site</a>
          <a href="/admin" onClick={(e) => { e.preventDefault(); logout() }}><FiLogOut /> Log out</a>
        </nav>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="photoAlbums" element={<PhotoAlbumManager />} />
          {Object.keys(SCHEMA).filter((k) => k !== 'photoAlbums' && k !== 'photos').map((k) => (
            <Route key={k} path={k} element={<CollectionManager collection={k} />} />
          ))}
          <Route path="photos" element={<CollectionManager collection="photos" />} />
          <Route path="about" element={<AboutFounderPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}