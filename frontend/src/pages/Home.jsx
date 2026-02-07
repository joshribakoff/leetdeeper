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

  return (
    <>
      <header>
        <h1>Dashboard</h1>
        <p className="subtitle">
          {summary.total_videos_watched} videos watched &middot; {summary.total_problems_solved} problems solved
        </p>
      </header>

      {patterns?.totals && (
        <section>
          <h2>Blind 75</h2>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-value">{patterns.totals.videos_watched}/{patterns.totals.videos_total}</span>
              <span className="stat-label">watched</span>
              <ProgressBar value={patterns.totals.videos_watched} max={patterns.totals.videos_total} />
            </div>
            <div className="stat-card">
              <span className="stat-value">{patterns.totals.problems_completed}/{patterns.totals.problems_total}</span>
              <span className="stat-label">solved</span>
              <ProgressBar value={patterns.totals.problems_completed} max={patterns.totals.problems_total} />
            </div>
          </div>
        </section>
      )}

      <section>
        <h2>Top Playlists</h2>
        <nav>
          {[...summary.playlists]
            .sort((a, b) => (b.total ? b.watched / b.total : 0) - (a.total ? a.watched / a.total : 0))
            .slice(0, 5)
            .map(pl => (
              <Link to={`/playlist/${pl.name}`} key={pl.name} className="card">
                <div className="card-header">
                  <span className="card-title">{pl.label}</span>
                  <span className="card-stat">{pl.watched}/{pl.total} watched</span>
                </div>
                <ProgressBar value={pl.watched} max={pl.total} />
              </Link>
            ))}
          <Link to="/playlists" className="card card--muted">
            <span className="card-title">View all playlists &rarr;</span>
          </Link>
        </nav>
      </section>
    </>
  )
}
