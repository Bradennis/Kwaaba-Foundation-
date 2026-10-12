import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import People from './pages/People.jsx'
import Programs from './pages/Programs.jsx'
import ProgramDetail from './pages/ProgramDetail.jsx'
import Events from './pages/Events.jsx'
import Resources from './pages/Resources.jsx'
import Newsletters from './pages/Newsletters.jsx'
import MediaMentions from './pages/MediaMentions.jsx'
import Videos from './pages/Videos.jsx'
import Gallery from './pages/Gallery.jsx'
import GetInvolved from './pages/GetInvolved.jsx'
import Contact from './pages/Contact.jsx'
import AdminApp from './admin/AdminApp.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="board" element={<People kind="board" />} />
          <Route path="team" element={<People kind="team" />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:slug" element={<ProgramDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="resources" element={<Resources />} />
          <Route path="newsletters" element={<Newsletters />} />
          <Route path="media" element={<MediaMentions />} />
          <Route path="videos" element={<Videos />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:albumSlug" element={<Gallery />} />
          <Route path="volunteer" element={<GetInvolved mode="volunteer" />} />
          <Route path="donate" element={<GetInvolved mode="donate" />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}
