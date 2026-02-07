import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function Playlists() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/summary').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <p className="loading">Loading...</p>

  const playlists = [...data.playlists].sort((a, b) => {
    const aPct = a.total ? a.watched / a.total : 0
    const bPct = b.total ? b.watched / b.total : 0
    return bPct !== aPct ? bPct - aPct : a.name.localeCompare(b.name)
  })

  return (
    <>
      <header>
        <h1>Playlists</h1>
        <p className="subtitle">{data.total_videos_watched} videos watched across {playlists.length} playlists</p>
      </header>

      <section>
        <nav>
          {playlists.map(pl => (
            <Link to={`/playlist/${pl.name}`} key={pl.name} className="card">
              <div className="card-header">
                <span className="card-title">{pl.label}</span>
                <span className="card-stat">{pl.watched}/{pl.total} watched</span>
              </div>
              <ProgressBar value={pl.watched} max={pl.total} />
            </Link>
          ))}
        </nav>
      </section>
    </>
  )
}
