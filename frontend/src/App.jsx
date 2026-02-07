import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Playlist from './pages/Playlist'
import Patterns from './pages/Patterns'

export default function App() {
  return (
    <main className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/playlist/:name" element={<Playlist />} />
      </Routes>
    </main>
  )
}
