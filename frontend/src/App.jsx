import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Playlist from './pages/Playlist'
import Patterns from './pages/Patterns'

export default function App() {
  return (
    <>
      <nav className="topnav">
        <div className="topnav-inner">
          <NavLink to="/" className="topnav-brand" end>LeetDeeper</NavLink>
          <div className="topnav-links">
            <NavLink to="/" end>Playlists</NavLink>
            <NavLink to="/patterns">Patterns</NavLink>
          </div>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/playlist/:name" element={<Playlist />} />
        </Routes>
      </main>
    </>
  )
}
