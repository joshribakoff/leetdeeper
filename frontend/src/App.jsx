import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Playlist from './pages/Playlist'
import Patterns from './pages/Patterns'

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/playlist/:name" element={<Playlist />} />
      </Routes>
    </div>
  )
}
