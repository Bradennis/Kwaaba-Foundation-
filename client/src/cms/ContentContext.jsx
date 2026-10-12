import { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { seedContent } from '../content/seed.js'

const AUTH_KEY = 'kwaaba_admin_auth'
const SERVER_URL = import.meta.env.VITE_SERVER_URL || ''

export const COLLECTIONS = [
  'slides', 'stats', 'programs', 'board', 'team',
  'events', 'posts', 'gallery', 'newsletters', 'quotes', 'videos',
]

export const ALBUM_COLLECTIONS = ['photoAlbums', 'photos']

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(seedContent)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function loadContent() {
      try {
        const res = await fetch(`${SERVER_URL}/api/content`)
        if (!res.ok) throw new Error('Failed to fetch content')
        const data = await res.json()

        if (mounted) {
          const merged = { ...seedContent }
          for (const key of Object.keys(data)) {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              merged[key] = data[key]
            }
          }
          setContent(merged)
        }
      } catch (e) {
        console.warn('Server fetch failed, using seed content:', e.message)
        if (mounted) {
          setError(e.message)
        }
      }
    }
    loadContent()
    return () => { mounted = false }
  }, [])

  const updateSettings = useCallback((patch) => {
    setContent((c) => c ? { ...c, settings: { ...c.settings, ...patch } } : c)
  }, [])

  const updateAbout = useCallback((patch) => {
    setContent((c) => c ? { ...c, about: { ...c.about, ...patch } } : c)
  }, [])

  const updateFounder = useCallback((patch) => {
    setContent((c) => c ? { ...c, founder: { ...c.founder, ...patch } } : c)
  }, [])

  const addItem = useCallback(async (collection, item) => {
    const id = collection.slice(0, 2) + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const newItem = { ...item, id }
    setContent((c) => c ? { ...c, [collection]: [...(c[collection] || []), newItem] } : c)
    return id
  }, [])

  const updateItem = useCallback(async (collection, id, patch) => {
    setContent((c) => c ? {
      ...c,
      [collection]: (c[collection] || []).map((it) => (it.id === id ? { ...it, ...patch } : it)),
    } : c)
  }, [])

  const removeItem = useCallback(async (collection, id) => {
    setContent((c) => c ? {
      ...c,
      [collection]: (c[collection] || []).filter((it) => it.id !== id),
    } : c)
  }, [])

  const moveItem = useCallback(async (collection, id, dir) => {
    setContent((c) => {
      if (!c) return c
      const arr = [...(c[collection] || [])]
      const i = arr.findIndex((it) => it.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= arr.length) return c
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...c, [collection]: arr }
    })
  }, [])

  const resetContent = useCallback(() => {
    setContent(seedContent)
  }, [])

  const value = {
    content, setContent, error,
    updateSettings, updateAbout, updateFounder,
    addItem, updateItem, removeItem, moveItem, resetContent,
    seedContent,
  }
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}

/* ---------- admin auth (client-side gate) ---------- */
export const ADMIN_PASSWORD = 'kwaaba2026'

const authListeners = new Set()
let authedSnapshot = typeof sessionStorage !== 'undefined' && Boolean(sessionStorage.getItem(AUTH_KEY))
function setAuthed(next) {
  authedSnapshot = next
  authListeners.forEach((fn) => fn())
}

export function useAuth() {
  const authed = useSyncExternalStore(
    (cb) => { authListeners.add(cb); return () => authListeners.delete(cb) },
    () => authedSnapshot,
  )
  const login = async (pw) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem(AUTH_KEY, data.token)
        setAuthed(true)
        return true
      }
    } catch (e) {
      console.warn('Server auth failed, falling back to local password')
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, '1')
        setAuthed(true)
        return true
      }
    }
    return false
  }
  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }
  const getToken = () => sessionStorage.getItem(AUTH_KEY)
  return { authed, login, logout, getToken }
}