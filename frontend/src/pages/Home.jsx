import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function Home() {
  const [summary, setSummary] = useState(null)
  const [patterns, setPatterns] = useState(null)

  useEffect(() => {
    fetch('/api/summary').then(r => r.json()).then(setSummary)
    fetch('/api/patterns').then(r => r.json()).then(setPatterns)
  }, [])

  if (!summary) return <p className="loading">Loading...</p>

  const playlists = [...summary.playlists].sort((a, b) => {
    const aPct = a.total ? a.watched / a.total : 0
    const bPct = b.total ? b.watched / b.total : 0
    return bPct !== aPct ? bPct - aPct : a.name.localeCompare(b.name)
  })

  return (
    <>
      <header>
        <p className="subtitle">
          {summary.total_videos_watched} videos watched &middot; {summary.total_problems_solved} problems solved
        </p>
      </header>

      {patterns?.totals && (
        <section>
          <Link to="/patterns" className="card card--featured">
            <div className="card-header">
              <span className="card-title">Blind 75 by Pattern</span>
              <span className="card-stat">
                {patterns.totals.videos_watched}/{patterns.totals.videos_total} videos &middot; {patterns.totals.problems_completed}/{patterns.totals.problems_total} problems
              </span>
            </div>
            <ProgressBar value={patterns.totals.videos_watched} max={patterns.totals.videos_total} />
          </Link>
        </section>
      )}

      <section>
        <h2>Playlists</h2>
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
