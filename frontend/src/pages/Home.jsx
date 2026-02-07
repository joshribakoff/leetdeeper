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

  if (!summary) return <div style={{ color: 'var(--dim)', padding: 40, textAlign: 'center' }}>Loading...</div>

  const playlists = [...summary.playlists].sort((a, b) => {
    const aPct = a.total ? a.watched / a.total : 0
    const bPct = b.total ? b.watched / b.total : 0
    if (bPct !== aPct) return bPct - aPct
    return a.name.localeCompare(b.name)
  })

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>LeetDeeper</h1>
      <div style={{ color: 'var(--dim)', fontSize: '0.9rem', marginBottom: 24 }}>
        {summary.total_videos_watched} videos watched &middot; {summary.total_problems_solved} problems solved
      </div>

      {/* Blind 75 Pattern Summary Card */}
      {patterns?.totals && (
        <Link to="/patterns">
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 16, marginBottom: 24,
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Blind 75 by Pattern</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>
                {patterns.totals.videos_watched}/{patterns.totals.videos_total} videos &middot; {patterns.totals.problems_completed}/{patterns.totals.problems_total} problems
              </span>
            </div>
            <ProgressBar value={patterns.totals.videos_watched} max={patterns.totals.videos_total} />
          </div>
        </Link>
      )}

      {/* All Playlists */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Playlists</h2>
      {playlists.map(pl => (
        <Link to={`/playlist/${pl.name}`} key={pl.name}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 16, marginBottom: 8,
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{pl.label}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>
                {pl.watched}/{pl.total} watched
              </span>
            </div>
            <ProgressBar value={pl.watched} max={pl.total} />
          </div>
        </Link>
      ))}
    </>
  )
}
