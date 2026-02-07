import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

function formatLabel(name) {
  return name.replace('youtube_', '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatTotalDuration(videos) {
  const totalSec = videos.reduce((sum, v) => sum + (v.duration || 0), 0)
  if (!totalSec) return null
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function Playlist() {
  const { name } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`/api/playlists/${name}`).then(r => r.json()).then(setData)
  }, [name])

  if (!data) return <div style={{ color: 'var(--dim)', padding: 40, textAlign: 'center' }}>Loading...</div>

  const downloaded = data.videos.filter(v => v.has_video).length
  const totalDuration = formatTotalDuration(data.videos)

  return (
    <>
      <Link to="/" style={{
        display: 'inline-block', border: '1px solid var(--border)',
        padding: '6px 14px', borderRadius: 6, fontSize: '0.85rem', marginBottom: 16,
      }}>Back</Link>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{formatLabel(name)}</h1>

      <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--dim)', marginBottom: 12 }}>
        <span>{data.total} videos</span>
        <span>{data.watched} watched ({data.pct}%)</span>
        <span>{downloaded} downloaded</span>
        {totalDuration && <span>{totalDuration} total</span>}
      </div>

      <ProgressBar value={data.watched} max={data.total} />

      <div style={{ marginTop: 16 }}>
        {data.videos.map(v => (
          <div key={v.index} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderBottom: '1px solid var(--border)',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: 'var(--dim)', minWidth: 28, textAlign: 'right', fontSize: '0.8rem' }}>
              {v.index}
            </span>
            <span style={{ fontSize: '1rem', minWidth: 20, color: v.watched ? 'var(--green)' : 'var(--border)' }}>
              {v.watched ? '\u2713' : '\u25CB'}
            </span>
            <img
              src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
              alt=""
              style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 4, background: 'var(--bar-bg)', flexShrink: 0 }}
              loading="lazy"
            />
            <span style={{ flex: 1 }}>{v.title}</span>
            {v.duration_fmt && (
              <span style={{ color: 'var(--dim)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', minWidth: 40, textAlign: 'right' }}>
                {v.duration_fmt}
              </span>
            )}
            <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer"
              style={{ color: 'var(--dim)', fontSize: '0.8rem' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--dim)'}
            >watch</a>
          </div>
        ))}
      </div>
    </>
  )
}
