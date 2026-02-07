import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Playlists from './pages/Playlists'
import Playlist from './pages/Playlist'
import Patterns from './pages/Patterns'
import Downloads from './pages/Downloads'

export default function App() {
  return (
    <>
      <nav className="topnav">
        <div className="topnav-inner">
          <NavLink to="/" className="topnav-brand" end>LeetDeeper</NavLink>
          <div className="topnav-links">
            <NavLink to="/playlists">Playlists</NavLink>
            <NavLink to="/patterns">Patterns</NavLink>
            <NavLink to="/downloads">Downloads</NavLink>
          </div>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/playlist/:name" element={<Playlist />} />
        </Routes>
      </main>
    </>
  )
}
