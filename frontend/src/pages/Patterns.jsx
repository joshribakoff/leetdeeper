import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function Patterns() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/patterns').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div style={{ color: 'var(--dim)', padding: 40, textAlign: 'center' }}>Loading...</div>

  return (
    <>
      <Link to="/" style={{
        display: 'inline-block', border: '1px solid var(--border)',
        padding: '6px 14px', borderRadius: 6, fontSize: '0.85rem', marginBottom: 16,
      }}>Back</Link>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Blind 75 by Pattern</h1>

      <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--dim)', marginBottom: 20 }}>
        <span>Videos: {data.totals.videos_watched}/{data.totals.videos_total}</span>
        <span>Problems: {data.totals.problems_completed}/{data.totals.problems_total}</span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <ProgressBar value={data.totals.videos_watched} max={data.totals.videos_total} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '180px 1fr 60px 1fr 60px',
          gap: 8, padding: '6px 12px', fontSize: '0.75rem', color: 'var(--dim)',
        }}>
          <span>Pattern</span>
          <span>Videos</span>
          <span></span>
          <span>Problems</span>
          <span></span>
        </div>
        {data.patterns.map(p => (
          <div key={p.name} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr 60px 1fr 60px',
            gap: 8, padding: '6px 12px', fontSize: '0.85rem',
            background: 'var(--surface)', borderRadius: 6,
          }}>
            <span style={{ fontWeight: 500 }}>{p.name}</span>
            <ProgressBar value={p.videos_watched} max={p.videos_total} height={6} />
            <span style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>
              {p.videos_watched}/{p.videos_total}
            </span>
            <ProgressBar value={p.problems_completed} max={p.problems_total} height={6} />
            <span style={{ fontSize: '0.75rem', color: p.problems_completed > 0 ? 'var(--green)' : 'var(--dim)' }}>
              {p.problems_completed}/{p.problems_total}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
